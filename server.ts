import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { generateMasterSvg, generateMediumSvg } from './src/server/vectorMockup.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Base64 image payloads require generous body size
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

// Shared Gemini client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Primary Nano-Banana model
const DEFAULT_IMAGE_MODEL = 'gemini-3.1-flash-lite-image';

interface ProductData {
  name: string;
  category?: string;
  tagline?: string;
  description: string;
  primaryColor?: string;
  secondaryColor?: string;
  materials?: string;
  brandAesthetic?: string;
}

const MEDIUM_CONFIGS: Record<
  string,
  {
    name: string;
    aspectRatio: '1:1' | '16:9' | '3:4' | '4:3' | '9:16';
    promptTemplate: (product: ProductData, userNotes?: string) => string;
  }
> = {
  billboard: {
    name: 'Highway / Times Square Billboard',
    aspectRatio: '16:9',
    promptTemplate: (p, notes) =>
      `A dramatic wide-angle outdoor photograph of an enormous towering commercial roadside advertising billboard at golden hour. ` +
      `The giant billboard prominently features a massive high-resolution advertisement for "${p.name}". ` +
      `The ad displays the exact product: ${p.description}. Brand colors ${p.primaryColor || 'sleek metallic'} and ${p.secondaryColor || 'vibrant accent'}. ` +
      `Headline text on the billboard reads "${p.tagline || p.name}". ` +
      `The billboard structure has sturdy steel girders and industrial spotlight fixtures mounted along the top. ` +
      `The background features an open expansive dusk sky with distant modern architectural city silhouette. ` +
      `${notes ? `Additional art direction: ${notes}. ` : ''}` +
      `ABSOLUTE MANDATORY REQUIREMENT: Strictly ZERO people, NO humans, NO crowds, NO pedestrians, NO drivers, NO silhouettes in this entire image. Pristine urban environment shot.`,
  },
  newspaper: {
    name: 'Vintage / Broadsheet Newspaper Print Ad',
    aspectRatio: '3:4',
    promptTemplate: (p, notes) =>
      `A high-resolution macro editorial photograph of an open broadsheet newspaper page lying flat on an aged dark oak library desk. ` +
      `A prominent half-page printed advertisement on the textured newsprint paper features "${p.name}". ` +
      `The ad showcases the exact product: ${p.description}. Authentic monochrome / duotone ink halftone dot printing pattern visible on vintage off-white newsprint paper texture. ` +
      `Surrounding the ad are genuine miniature editorial news columns with vintage serif headline typography. ` +
      `Natural daylight from a nearby window creates soft shadows across the gentle paper folds. ` +
      `${notes ? `Additional art direction: ${notes}. ` : ''}` +
      `ABSOLUTE MANDATORY REQUIREMENT: Strictly ZERO people, NO humans, NO hands holding the paper, NO faces, NO readers. Only the newspaper and desk.`,
  },
  social_post: {
    name: 'Social Media Feed / Sleek Post',
    aspectRatio: '1:1',
    promptTemplate: (p, notes) =>
      `A pristine modern commercial social media product advertisement mockup in square format for "${p.name}". ` +
      `The hero subject is the exact product: ${p.description}, styled in a hyper-clean contemporary luxury aesthetic with soft studio illumination. ` +
      `Materials: ${p.materials || 'frosted glass, brushed aluminum, matte finish'}. Brand colors: ${p.primaryColor || 'primary hue'} with ${p.secondaryColor || 'subtle highlight'}. ` +
      `Product stands centered on a sculpted architectural pedestal with crisp minimalist geometry, soft cast shadows, and subtle floating brand typography "${p.tagline || p.name}". ` +
      `${notes ? `Additional art direction: ${notes}. ` : ''}` +
      `ABSOLUTE MANDATORY REQUIREMENT: Strictly ZERO people, NO humans, NO hands, NO models, NO faces. Pure product aesthetic perfection.`,
  },
  bus_shelter: {
    name: 'Transit Shelter / Bus Stop Lightbox',
    aspectRatio: '3:4',
    promptTemplate: (p, notes) =>
      `An eye-level atmospheric evening photograph of a modern illuminated glass-and-steel transit shelter advertising display on a quiet city sidewalk after rain. ` +
      `Inside the backlit tempered glass poster case, a glowing high-resolution commercial poster features "${p.name}". ` +
      `The ad displays the exact product: ${p.description}, with luminous branding and colors (${p.primaryColor || 'brand tone'}). ` +
      `Reflections of city streetlamps and damp pavement puddles mirror the warm backlight of the poster. ` +
      `${notes ? `Additional art direction: ${notes}. ` : ''}` +
      `ABSOLUTE MANDATORY REQUIREMENT: Strictly ZERO people, NO humans, NO commuters, NO pedestrians, NO passersby, NO shadows of people. The street and shelter are entirely empty.`,
  },
  subway: {
    name: 'Subway Platform Lightbox',
    aspectRatio: '16:9',
    promptTemplate: (p, notes) =>
      `A panoramic interior photograph of a sleek, modern architectural metro station platform. ` +
      `Mounted directly on the polished ceramic tiled subterranean wall is a wide illuminated lightbox advertisement showcasing "${p.name}". ` +
      `The advertisement displays the exact product: ${p.description}. Sharp commercial typography and pristine product photography. ` +
      `Clean industrial aesthetic, brushed metal frame around the lightbox, fluorescent platform ambient light glinting on pristine tiled floor. ` +
      `${notes ? `Additional art direction: ${notes}. ` : ''}` +
      `ABSOLUTE MANDATORY REQUIREMENT: Strictly ZERO people, NO humans, NO commuters, NO train passengers. Entire underground station platform is deserted.`,
  },
  packaging: {
    name: 'Luxury Packaging & Unboxing',
    aspectRatio: '1:1',
    promptTemplate: (p, notes) =>
      `A luxurious commercial still-life photograph of the premium custom packaging and unboxing presentation for "${p.name}". ` +
      `The exact product (${p.description}) sits gracefully beside its bespoke rigid gift box with embossed metallic foil logo, textured heavy cardstock, and custom molded velvet interior cradle. ` +
      `Color harmony matching ${p.primaryColor || 'brand base'} and ${p.secondaryColor || 'accent'}. ` +
      `Soft cinematic studio lighting highlights the premium paper grain, crisp edges, and immaculate finish. ` +
      `${notes ? `Additional art direction: ${notes}. ` : ''}` +
      `ABSOLUTE MANDATORY REQUIREMENT: Strictly ZERO people, NO humans, NO hands opening or holding the box. Pristine tabletop composition.`,
  },
  magazine: {
    name: 'Glossy Editorial Magazine Spread',
    aspectRatio: '3:4',
    promptTemplate: (p, notes) =>
      `A top-down editorial still-life photograph of a thick luxury lifestyle glossy magazine opened to a full-page color advertisement for "${p.name}". ` +
      `The glossy full-bleed page features high-fashion product photography of ${p.description}. ` +
      `The opposite page shows subtle minimalist typography and layout. ` +
      `Light reflects off the satin sheen of the heavy art paper with realistic page curvature, resting on a textured linen surface. ` +
      `${notes ? `Additional art direction: ${notes}. ` : ''}` +
      `ABSOLUTE MANDATORY REQUIREMENT: Strictly ZERO people, NO humans, NO hands, NO models. Just the open magazine on linen.`,
  },
  storefront: {
    name: 'Department Storefront Window Display',
    aspectRatio: '4:3',
    promptTemplate: (p, notes) =>
      `A sophisticated nighttime photograph looking through the massive exterior plate-glass window of a luxury flagship department store. ` +
      `Inside the illuminated display window, an artistic installation showcases "${p.name}". ` +
      `The exact product (${p.description}) is elevated on a bespoke tiered marble and brass pedestal under tailored optical spotlights. ` +
      `Architectural geometric backdrop matching brand colors ${p.primaryColor || 'deep tones'} and ${p.secondaryColor || 'warm highlights'}. ` +
      `Subtle reflections of nighttime street architecture in the clean outer glass pane. ` +
      `${notes ? `Additional art direction: ${notes}. ` : ''}` +
      `ABSOLUTE MANDATORY REQUIREMENT: Strictly ZERO people, NO humans, NO shoppers, NO mannequins, NO pedestrians. Pure architectural window display.`,
  },
};

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    ok: true,
    hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    models: {
      default: DEFAULT_IMAGE_MODEL,
      highQuality: 'gemini-nano-banana-2.1',
    },
    mediums: Object.entries(MEDIUM_CONFIGS).map(([id, cfg]) => ({
      id,
      name: cfg.name,
      aspectRatio: cfg.aspectRatio,
    })),
  });
});

// Refine / polish product description for better generative consistency
app.post('/api/refine-product', async (req: Request, res: Response) => {
  try {
    const { name, category, roughIdea, primaryColor, secondaryColor, materials } = req.body;

    const prompt = `You are a world-class brand strategist and industrial design visualizer.
The user wants to visualize a product called "${name}" (${category || 'General Product'}).
User's brief: "${roughIdea || ''}"
Colors: ${primaryColor || 'unspecified'}, ${secondaryColor || 'unspecified'}.
Materials: ${materials || 'unspecified'}.

Create a concise, visually cohesive product identity sheet with high physical specificity so image generation models can reproduce the exact same product across diverse advertising mediums.
Return valid JSON with:
1. "visualAnchor": A vivid 2-3 sentence physical description focusing on exact silhouette, container/body shape, material finishes, label/logo placement, and signature details (e.g., "A heavy-bottom cylindrical frosted glass bottle with a brushed champagne-gold twist dropper cap...").
2. "tagline": A punchy, premium 3-6 word advertising slogan.
3. "palette": An array of 3 hex colors (e.g. ["#1A2E3B", "#C5A880", "#F4F1EA"]).
4. "keyMaterials": String of specific materials (e.g. "Frosted borosilicate glass, brushed brass, matte debossed paper").
5. "recommendedCategory": The best fitting industry category.

Do NOT include any mention of human models, people, or actors in the visualAnchor.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ ok: true, data: parsed });
  } catch (error: any) {
    console.error('Refine error:', error);
    res.status(500).json({
      ok: false,
      error: error?.message || 'Failed to polish product description',
    });
  }
});

// Generate Master Packshot (Canonical Anchor)
app.post('/api/generate-master', async (req: Request, res: Response) => {
  try {
    const {
      name,
      category,
      tagline,
      description,
      primaryColor,
      secondaryColor,
      materials,
      brandAesthetic,
      model = DEFAULT_IMAGE_MODEL,
    } = req.body;

    if (!description && !name) {
      return res.status(400).json({ ok: false, error: 'Product name and description are required' });
    }

    const masterPrompt =
      `Commercial master packshot studio photography of the product "${name}". ` +
      `Product details: ${description}. ` +
      `Materials & Finishes: ${materials || 'premium tactile finishes, crisp industrial design'}. ` +
      `Colorway: primary ${primaryColor || 'signature hue'}, accent ${secondaryColor || 'complementary tone'}. ` +
      `Aesthetic style: ${brandAesthetic || 'ultra-clean minimalist luxury commercial product photography'}. ` +
      `Centered isolated packshot composition on a neutral textured cyclorama studio surface with soft diffused 3-point studio lighting, sharp focus, clean edge separation, 8k resolution commercial catalog quality. ` +
      `MANDATORY RESTRICTION: Absolutely NO people, NO humans, NO hands, NO faces, NO reflections of people. Pure isolated product shot.`;

    console.log(`[Master Shot] Generating using ${model}...`);

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            text: masterPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: '1:1',
          ...(model === 'gemini-nano-banana-2.1' ? { imageSize: '1K' } : {}),
        },
      },
    });

    let imageUrl = '';
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      const textOutput = parts.map((p) => p.text).filter(Boolean).join(' ');
      throw new Error(textOutput || 'No image was generated by the model.');
    }

    res.json({
      ok: true,
      imageUrl,
      prompt: masterPrompt,
      model,
    });
  } catch (error: any) {
    console.warn('[Master Shot] Nano-Banana API error, falling back to Studio Vector Engine:', error?.message);
    const svg = generateMasterSvg(req.body);
    const base64Svg = Buffer.from(svg).toString('base64');
    const imageUrl = `data:image/svg+xml;base64,${base64Svg}`;
    res.json({
      ok: true,
      imageUrl,
      prompt: `Commercial studio packshot for "${req.body.name}". Strict zero-humans guard. (Rendered via Studio Vector Engine)`,
      model: 'Studio Engine (Nano-Banana Fallback)',
      isFallback: true,
      notice: 'Rendered with Studio Vector Engine because paid API key was declined or unavailable.',
    });
  }
});

// Generate Medium Shot (Billboard, Newspaper, Social Post, etc.)
app.post('/api/generate-medium', async (req: Request, res: Response) => {
  try {
    const {
      mediumId,
      product,
      referenceImage,
      customNotes,
      model = DEFAULT_IMAGE_MODEL,
    } = req.body;

    const config = MEDIUM_CONFIGS[mediumId];
    if (!config) {
      return res.status(400).json({ ok: false, error: `Invalid medium: ${mediumId}` });
    }

    const basePrompt = config.promptTemplate(product, customNotes);

    console.log(`[Medium Shot: ${mediumId}] Generating with model ${model}, aspect ${config.aspectRatio}...`);

    const parts: any[] = [];

    // If a reference image is available, pass it first to maintain visual consistency
    if (referenceImage && typeof referenceImage === 'string') {
      const match = referenceImage.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const base64Data = match[2];
        parts.push({
          inlineData: {
            mimeType,
            data: base64Data,
          },
        });
        // Consistency instruction linking reference image to medium scene
        const consistencyDirective =
          `CONSISTENCY REFERENCE IMAGE ATTACHED: You MUST faithfully preserve and recreate the EXACT product shown in the attached image (same shape, exact proportions, identical colors, branding, logo details, and materials). ` +
          `Now depict this IDENTICAL product in the following advertisement context: ` +
          basePrompt;
        parts.push({ text: consistencyDirective });
      } else {
        parts.push({ text: basePrompt });
      }
    } else {
      parts.push({ text: basePrompt });
    }

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts,
      },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
          ...(model === 'gemini-nano-banana-2.1' ? { imageSize: '1K' } : {}),
        },
      },
    });

    let imageUrl = '';
    const responseParts = response.candidates?.[0]?.content?.parts || [];
    for (const part of responseParts) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      const textOutput = responseParts.map((p) => p.text).filter(Boolean).join(' ');
      throw new Error(textOutput || `Failed to generate ${config.name} image.`);
    }

    res.json({
      ok: true,
      mediumId,
      mediumName: config.name,
      aspectRatio: config.aspectRatio,
      imageUrl,
      promptUsed: basePrompt,
      model,
    });
  } catch (error: any) {
    console.warn(`[Medium Shot: ${req.body?.mediumId}] Nano-Banana API error, falling back to Studio Vector Engine:`, error?.message);
    const config = MEDIUM_CONFIGS[req.body?.mediumId] || { name: req.body?.mediumId, aspectRatio: '1:1' };
    const svg = generateMediumSvg(req.body?.mediumId, req.body?.product || {}, req.body?.customNotes);
    const base64Svg = Buffer.from(svg).toString('base64');
    const imageUrl = `data:image/svg+xml;base64,${base64Svg}`;
    res.json({
      ok: true,
      mediumId: req.body?.mediumId,
      mediumName: config.name,
      aspectRatio: config.aspectRatio,
      imageUrl,
      promptUsed: config.promptTemplate ? config.promptTemplate(req.body?.product || {}, req.body?.customNotes) : 'Art direction prompt with strict zero-humans constraint',
      model: 'Studio Engine (Nano-Banana Fallback)',
      isFallback: true,
      notice: 'Rendered with Studio Vector Engine because paid API key was declined or unavailable.',
    });
  }
});

// Start server and Vite integration
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Brand Builder] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
