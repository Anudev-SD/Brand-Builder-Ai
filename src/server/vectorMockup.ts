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

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateMasterSvg(product: ProductData): string {
  const primary = product.primaryColor || '#2D4A3E';
  const secondary = product.secondaryColor || '#D4AF37';
  const name = escapeXml(product.name || 'Master Product');
  const tagline = escapeXml(product.tagline || 'Purity & Craftsmanship');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
    <defs>
      <radialGradient id="bgGlow" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#090d16" />
      </radialGradient>
      <linearGradient id="pedestalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#334155" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
      <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primary}" />
        <stop offset="70%" stop-color="#0b1319" />
        <stop offset="100%" stop-color="${secondary}" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${secondary}" />
        <stop offset="100%" stop-color="#fff5cc" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="25" stdDeviation="20" flood-color="#000000" flood-opacity="0.8" />
      </filter>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Studio Backdrop -->
    <rect width="1000" height="1000" fill="url(#bgGlow)" />

    <!-- Floor Cyclorama Horizon -->
    <ellipse cx="500" cy="850" rx="420" ry="90" fill="#030712" opacity="0.6" />

    <!-- Soft Overhead Studio Light Cone -->
    <polygon points="250,0 750,0 650,700 350,700" fill="url(#accentGrad)" opacity="0.04" />

    <!-- Minimalist Architectural Pedestal -->
    <g filter="url(#shadow)">
      <ellipse cx="500" cy="740" rx="260" ry="40" fill="url(#pedestalGrad)" stroke="#475569" stroke-width="2" />
      <path d="M 240,740 L 240,780 C 240,820 760,820 760,780 L 760,740 Z" fill="#0f172a" stroke="#334155" stroke-width="2" />
      <ellipse cx="500" cy="780" rx="260" ry="40" fill="#090d16" />
    </g>

    <!-- Product Packshot Silhouette -->
    <g filter="url(#shadow)">
      <!-- Main Vessel Container (Glass/Ceramic/Metal Packshot) -->
      <rect x="390" y="360" width="220" height="340" rx="28" fill="url(#bottleGrad)" stroke="${secondary}" stroke-width="3" />
      
      <!-- Specular Highlight Line (Glass Reflection) -->
      <path d="M 410,380 L 410,680" stroke="#ffffff" stroke-width="6" opacity="0.4" stroke-linecap="round" />
      <path d="M 425,390 L 425,670" stroke="#ffffff" stroke-width="2" opacity="0.25" stroke-linecap="round" />

      <!-- Metallic Cap / Closure Collar -->
      <rect x="440" y="270" width="120" height="90" rx="10" fill="url(#accentGrad)" stroke="#b89332" stroke-width="2" />
      <line x1="440" y1="300" x2="560" y2="300" stroke="#8c6a1e" stroke-width="2" />
      <line x1="440" y1="330" x2="560" y2="330" stroke="#8c6a1e" stroke-width="2" />

      <!-- Dropper / Seal Finial -->
      <rect x="475" y="220" width="50" height="50" rx="8" fill="#1e293b" stroke="${secondary}" stroke-width="2" />

      <!-- Minimalist Embossed Product Label -->
      <rect x="415" y="440" width="170" height="210" rx="10" fill="#ffffff" opacity="0.94" filter="url(#shadow)" />
      
      <!-- Label Details -->
      <line x1="435" y1="465" x2="565" y2="465" stroke="${secondary}" stroke-width="2" />
      
      <!-- Brand Seal Icon -->
      <circle cx="500" cy="495" r="14" fill="none" stroke="${secondary}" stroke-width="2" />
      <circle cx="500" cy="495" r="7" fill="${primary}" />

      <!-- Typography -->
      <text x="500" y="535" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="#0f172a" text-anchor="middle" letter-spacing="2">
        ${name.toUpperCase()}
      </text>
      
      <text x="500" y="560" font-family="system-ui, sans-serif" font-size="9" font-weight="600" fill="#64748b" text-anchor="middle" letter-spacing="1.5">
        ${tagline.toUpperCase()}
      </text>

      <line x1="450" y1="580" x2="550" y2="580" stroke="#e2e8f0" stroke-width="1" />

      <text x="500" y="605" font-family="monospace" font-size="8" fill="#94a3b8" text-anchor="middle">
        STUDIO CANONICAL MASTER
      </text>
      <text x="500" y="625" font-family="monospace" font-size="8" fill="${secondary}" text-anchor="middle" font-weight="bold">
        0 HUMANS • NANO-BANANA ENGINE
      </text>
    </g>

    <!-- Studio Quality Stamp Badge -->
    <g transform="translate(80, 80)">
      <circle cx="45" cy="45" r="40" fill="#0f172a" stroke="${secondary}" stroke-width="2" />
      <text x="45" y="42" font-family="system-ui, sans-serif" font-size="9" font-weight="800" fill="#f8fafc" text-anchor="middle">
        MASTER
      </text>
      <text x="45" y="56" font-family="system-ui, sans-serif" font-size="8" font-weight="600" fill="${secondary}" text-anchor="middle">
        PACKSHOT
      </text>
    </g>
  </svg>`;
}

export function generateMediumSvg(
  mediumId: string,
  product: ProductData,
  userNotes?: string
): string {
  const primary = product.primaryColor || '#2D4A3E';
  const secondary = product.secondaryColor || '#D4AF37';
  const name = escapeXml(product.name || 'Brand Product');
  const tagline = escapeXml(product.tagline || 'Imagine The Exceptional');

  switch (mediumId) {
    case 'billboard':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0f172a" />
            <stop offset="50%" stop-color="#1e1b4b" />
            <stop offset="80%" stop-color="#7c2d12" />
            <stop offset="100%" stop-color="#ea580c" />
          </linearGradient>
          <linearGradient id="boardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${primary}" />
            <stop offset="100%" stop-color="#05070a" />
          </linearGradient>
          <filter id="billboardShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="30" stdDeviation="25" flood-color="#000000" flood-opacity="0.9" />
          </filter>
        </defs>

        <!-- Golden Hour Dusk Sky -->
        <rect width="1600" height="900" fill="url(#skyGrad)" />

        <!-- Distant City Silhouette Horizon (Deserted / No People) -->
        <path d="M 0,780 L 120,780 L 120,680 L 200,680 L 200,740 L 280,740 L 320,620 L 390,620 L 390,780 L 600,780 L 650,650 L 720,650 L 720,780 L 1100,780 L 1150,700 L 1220,700 L 1220,780 L 1600,780 L 1600,900 L 0,900 Z" fill="#090d16" />

        <!-- Distant Highway Viaduct / Empty Road -->
        <path d="M 0,820 L 1600,820 L 1600,900 L 0,900 Z" fill="#020408" />

        <!-- Giant Steel Support Pillars for Billboard -->
        <rect x="750" y="440" width="30" height="380" fill="#334155" />
        <rect x="820" y="440" width="30" height="380" fill="#1e293b" />
        <!-- Cross Bracing Girders -->
        <line x1="750" y1="480" x2="850" y2="580" stroke="#475569" stroke-width="6" />
        <line x1="850" y1="480" x2="750" y2="580" stroke="#475569" stroke-width="6" />
        <line x1="750" y1="580" x2="850" y2="680" stroke="#475569" stroke-width="6" />
        <line x1="850" y1="580" x2="750" y2="680" stroke="#475569" stroke-width="6" />

        <!-- Giant Billboard Display Canvas -->
        <g filter="url(#billboardShadow)">
          <!-- Billboard Outer Industrial Frame -->
          <rect x="250" y="100" width="1100" height="420" rx="12" fill="#0f172a" stroke="#64748b" stroke-width="8" />
          
          <!-- Inner Ad Surface -->
          <rect x="270" y="120" width="1060" height="380" rx="6" fill="url(#boardGrad)" />

          <!-- Ad Background Graphic Glow -->
          <circle cx="1020" cy="310" r="160" fill="${secondary}" opacity="0.15" />

          <!-- Product Packshot on the Billboard Ad -->
          <g transform="translate(930, 160)">
            <!-- Bottle / Pack -->
            <rect x="0" y="60" width="170" height="230" rx="20" fill="${primary}" stroke="${secondary}" stroke-width="4" />
            <path d="M 15,80 L 15,270" stroke="#ffffff" stroke-width="4" opacity="0.4" stroke-linecap="round" />
            <!-- Cap -->
            <rect x="40" y="10" width="90" height="50" rx="8" fill="${secondary}" />
            <!-- Label -->
            <rect x="25" y="120" width="120" height="130" rx="8" fill="#ffffff" opacity="0.95" />
            <text x="85" y="165" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#0f172a" text-anchor="middle">
              ${name.toUpperCase()}
            </text>
            <circle cx="85" cy="195" r="8" fill="${secondary}" />
          </g>

          <!-- Commercial Billboard Typography -->
          <text x="330" y="230" font-family="system-ui, sans-serif" font-size="44" font-weight="900" fill="#ffffff" letter-spacing="1">
            ${name.toUpperCase()}
          </text>
          
          <text x="330" y="285" font-family="system-ui, sans-serif" font-size="24" font-weight="600" fill="${secondary}" letter-spacing="2">
            ${tagline.toUpperCase()}
          </text>

          <text x="330" y="340" font-family="system-ui, sans-serif" font-size="16" fill="#cbd5e1" max-width="500">
            Available at premier luxury boutiques worldwide.
          </text>

          <!-- CTA Pill on Billboard -->
          <rect x="330" y="380" width="220" height="50" rx="25" fill="${secondary}" />
          <text x="440" y="412" font-family="system-ui, sans-serif" font-size="15" font-weight="bold" fill="#090d16" text-anchor="middle">
            EXPLORE COLLECTION
          </text>

          <!-- Spotlights on Billboard Walkway -->
          <rect x="250" y="520" width="1100" height="16" fill="#1e293b" />
          <circle cx="450" cy="528" r="12" fill="#fef08a" />
          <circle cx="750" cy="528" r="12" fill="#fef08a" />
          <circle cx="1050" cy="528" r="12" fill="#fef08a" />
          <!-- Upward light cones -->
          <polygon points="450,528 350,300 550,300" fill="#fef08a" opacity="0.12" />
          <polygon points="750,528 650,300 850,300" fill="#fef08a" opacity="0.12" />
          <polygon points="1050,528 950,300 1150,300" fill="#fef08a" opacity="0.12" />
        </g>

        <!-- Zero Humans Verification Watermark -->
        <text x="1560" y="870" font-family="monospace" font-size="12" fill="#64748b" text-anchor="end">
          MONUMENTAL BILLBOARD 16:9 • STRICTLY ZERO PEOPLE
        </text>
      </svg>`;

    case 'newspaper':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200" width="900" height="1200">
        <defs>
          <filter id="paperShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="8" dy="12" stdDeviation="10" flood-color="#000000" flood-opacity="0.3" />
          </filter>
          <pattern id="halftone" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.5" fill="#18181b" opacity="0.55" />
          </pattern>
        </defs>

        <!-- Dark Oak Table Background -->
        <rect width="900" height="1200" fill="#1a1412" />
        <line x1="0" y1="600" x2="900" y2="600" stroke="#261c17" stroke-width="40" opacity="0.3" />

        <!-- Broadsheet Newspaper Page -->
        <g filter="url(#paperShadow)" transform="translate(60, 60)">
          <!-- Aged Newsprint Paper Texture -->
          <rect width="780" height="1080" fill="#f5f2eb" rx="2" stroke="#d5cebf" stroke-width="1" />
          <line x1="390" y1="0" x2="390" y2="1080" stroke="#e0dacf" stroke-width="2" />

          <!-- Newspaper Header & Masthead -->
          <text x="390" y="70" font-family="Georgia, serif" font-size="44" font-weight="900" fill="#18181b" text-anchor="middle" letter-spacing="3">
            THE CHRONICLE DISPATCH
          </text>
          <line x1="40" y1="90" x2="740" y2="90" stroke="#18181b" stroke-width="3" />
          
          <!-- Date / Edition Bar -->
          <text x="50" y="108" font-family="Georgia, serif" font-size="11" fill="#52525b">
            VOL. CXXXVIII NO. 42
          </text>
          <text x="390" y="108" font-family="Georgia, serif" font-size="11" fill="#52525b" text-anchor="middle">
            OCTOBER 20, 2026 • COMMERCIAL REGISTER
          </text>
          <text x="730" y="108" font-family="Georgia, serif" font-size="11" fill="#52525b" text-anchor="end">
            TWO SHILLINGS
          </text>
          <line x1="40" y1="116" x2="740" y2="116" stroke="#18181b" stroke-width="1" />

          <!-- Top Article Columns -->
          <g fill="#27272a" font-family="Georgia, serif">
            <text x="50" y="150" font-size="20" font-weight="bold">INNOVATIONS IN COMMERCE</text>
            <text x="50" y="175" font-size="10" fill="#52525b" max-width="320">
              New industrial design paradigms reshape global markets with emphasis on timeless tactile materials and aesthetic purity.
            </text>
            <line x1="50" y1="190" x2="360" y2="190" stroke="#d4d4d8" stroke-width="1" />

            <text x="420" y="150" font-size="20" font-weight="bold">METROPOLITAN GAZETTE</text>
            <text x="420" y="175" font-size="10" fill="#52525b">
              Urban architecture evolves as historic precincts blend modern facades with classic editorial sensibilities.
            </text>
            <line x1="420" y1="190" x2="730" y2="190" stroke="#d4d4d8" stroke-width="1" />
          </g>

          <!-- PROMINENT HALF-PAGE NEWSPAPER ADVERTISEMENT -->
          <g transform="translate(45, 230)">
            <!-- Classic Double Frame Border -->
            <rect width="690" height="580" fill="#faf8f5" stroke="#18181b" stroke-width="3" />
            <rect x="6" y="6" width="678" height="568" fill="none" stroke="#18181b" stroke-width="1" />

            <!-- Halftone Shaded Illustration Area for Product -->
            <rect x="360" y="60" width="280" height="380" fill="url(#halftone)" stroke="#18181b" stroke-width="2" />
            
            <!-- Halftone Product Silhouette -->
            <g transform="translate(410, 100)">
              <!-- Bottle Shape in Monochrome Halftone / Lithograph -->
              <rect x="30" y="60" width="120" height="200" rx="16" fill="#18181b" />
              <rect x="55" y="20" width="70" height="40" rx="6" fill="#3f3f46" stroke="#18181b" stroke-width="2" />
              <rect x="45" y="110" width="90" height="110" rx="4" fill="#faf8f5" stroke="#18181b" stroke-width="1" />
              <text x="90" y="150" font-family="Georgia, serif" font-size="12" font-weight="900" fill="#18181b" text-anchor="middle">
                ${name.toUpperCase()}
              </text>
              <line x1="60" y1="165" x2="120" y2="165" stroke="#18181b" stroke-width="1" />
              <text x="90" y="185" font-family="Georgia, serif" font-size="8" fill="#52525b" text-anchor="middle">
                GENUINE PURITY
              </text>
            </g>

            <!-- Ad Headline & Classic Litho Copy -->
            <text x="50" y="100" font-family="Georgia, serif" font-size="34" font-weight="bold" fill="#18181b">
              ${name.toUpperCase()}
            </text>
            
            <text x="50" y="135" font-family="Georgia, serif" font-size="16" font-style="italic" fill="#52525b">
              ${tagline}
            </text>

            <line x1="50" y1="160" x2="320" y2="160" stroke="#18181b" stroke-width="2" />

            <text x="50" y="195" font-family="Georgia, serif" font-size="12" fill="#27272a" width="280">
              Crafted without compromise for the discerning patron.
            </text>
            <text x="50" y="225" font-family="Georgia, serif" font-size="11" fill="#52525b">
              Materials: ${escapeXml(product.materials || 'Pure artisanal components')}
            </text>
            <text x="50" y="250" font-family="Georgia, serif" font-size="11" fill="#52525b">
              Signature palette: ${primary} and ${secondary}.
            </text>
            <text x="50" y="275" font-family="Georgia, serif" font-size="11" fill="#52525b">
              Exclusively presented without living presence.
            </text>

            <!-- Decorative Vintage Seal -->
            <circle cx="120" cy="380" r="45" fill="none" stroke="#18181b" stroke-width="2" stroke-dasharray="4,2" />
            <circle cx="120" cy="380" r="38" fill="none" stroke="#18181b" stroke-width="1" />
            <text x="120" y="375" font-family="Georgia, serif" font-size="9" font-weight="bold" fill="#18181b" text-anchor="middle">
              ORIGINAL
            </text>
            <text x="120" y="392" font-family="Georgia, serif" font-size="8" fill="#18181b" text-anchor="middle">
              STANDARD
            </text>

            <!-- Ad Call to Action -->
            <rect x="50" y="470" width="590" height="60" fill="#18181b" />
            <text x="345" y="507" font-family="Georgia, serif" font-size="16" font-weight="bold" fill="#f5f2eb" text-anchor="middle" letter-spacing="3">
              DEMAND NOTHING LESS THAN PERFECTION
            </text>
          </g>

          <!-- Bottom Editorial Filler (Empty, No people) -->
          <g transform="translate(45, 840)" font-family="Georgia, serif" font-size="9" fill="#71717a">
            <text x="0" y="20">Section B • Page 7 • Published daily for metropolitan readers.</text>
            <text x="0" y="38">Strict zero-humans verified layout on archival newsprint stock.</text>
          </g>
        </g>
      </svg>`;

    case 'social_post':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
        <defs>
          <linearGradient id="socialBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0a0f1d" />
            <stop offset="40%" stop-color="${primary}" />
            <stop offset="100%" stop-color="#020408" />
          </linearGradient>
          <linearGradient id="glowCircle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${secondary}" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>
          <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="25" stdDeviation="30" flood-color="#000000" flood-opacity="0.8" />
          </filter>
        </defs>

        <!-- Modern Dark Luxury Studio Backdrop -->
        <rect width="1080" height="1080" fill="url(#socialBg)" />

        <!-- Atmospheric Glow Spheres -->
        <circle cx="780" cy="350" r="280" fill="url(#glowCircle)" opacity="0.25" />
        <circle cx="280" cy="850" r="200" fill="${primary}" opacity="0.3" />

        <!-- Minimalist Architectural Grid Lines -->
        <line x1="80" y1="80" x2="1000" y2="80" stroke="#ffffff" stroke-width="1" opacity="0.1" />
        <line x1="80" y1="80" x2="80" y2="1000" stroke="#ffffff" stroke-width="1" opacity="0.1" />

        <!-- Social Brand Header Bar -->
        <g transform="translate(80, 110)">
          <circle cx="25" cy="25" r="22" fill="${secondary}" />
          <text x="25" y="32" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#090d16" text-anchor="middle">
            ${name.charAt(0)}
          </text>
          <text x="65" y="24" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#ffffff">
            ${name}
          </text>
          <text x="65" y="42" font-family="system-ui, sans-serif" font-size="12" fill="#94a3b8">
            Official Collection • Studio Pack
          </text>
          
          <rect x="790" y="8" width="130" height="34" rx="17" fill="#ffffff" opacity="0.1" stroke="#ffffff" stroke-width="1" />
          <text x="855" y="30" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#f8fafc" text-anchor="middle">
            FOLLOW
          </text>
        </g>

        <!-- Center Stage: Sculpted Pedestal with Product Packshot -->
        <g filter="url(#cardShadow)">
          <!-- Circular floating pedestal -->
          <ellipse cx="540" cy="780" rx="280" ry="50" fill="#1e293b" stroke="#334155" stroke-width="3" />
          <ellipse cx="540" cy="780" rx="200" ry="32" fill="#0f172a" stroke="${secondary}" stroke-width="2" />
          
          <!-- Product Hero Object (Isolated 0 Humans) -->
          <g transform="translate(430, 360)">
            <!-- Bottle Body -->
            <rect x="20" y="80" width="180" height="280" rx="24" fill="${primary}" stroke="${secondary}" stroke-width="3" />
            <!-- Specular Light Reflection -->
            <path d="M 35,100 L 35,330" stroke="#ffffff" stroke-width="5" opacity="0.45" stroke-linecap="round" />
            <!-- Cap -->
            <rect x="65" y="20" width="90" height="60" rx="10" fill="${secondary}" stroke="#ffffff" stroke-width="1" />
            <!-- Label -->
            <rect x="40" y="160" width="140" height="150" rx="8" fill="#ffffff" opacity="0.95" />
            <text x="110" y="210" font-family="system-ui, sans-serif" font-size="15" font-weight="900" fill="#0f172a" text-anchor="middle" letter-spacing="1">
              ${name.toUpperCase()}
            </text>
            <text x="110" y="235" font-family="system-ui, sans-serif" font-size="9" font-weight="600" fill="${secondary}" text-anchor="middle">
              ${tagline.toUpperCase()}
            </text>
            <line x1="65" y1="255" x2="155" y2="255" stroke="#e2e8f0" stroke-width="1" />
            <text x="110" y="275" font-family="monospace" font-size="8" fill="#64748b" text-anchor="middle">
              PURITY VERIFIED
            </text>
          </g>
        </g>

        <!-- Social Overlay Typography -->
        <g transform="translate(80, 890)">
          <text x="0" y="30" font-family="system-ui, sans-serif" font-size="32" font-weight="800" fill="#ffffff">
            ${name}
          </text>
          <text x="0" y="60" font-family="system-ui, sans-serif" font-size="16" font-weight="500" fill="${secondary}">
            ${tagline}
          </text>
          <text x="0" y="85" font-family="system-ui, sans-serif" font-size="12" fill="#94a3b8">
            #BrandBuilder #IndustrialDesign #ConsistentAesthetic #NoHumans #ProductHero
          </text>

          <!-- Interactive Action Icons (Like, Comment, Share) -->
          <g transform="translate(750, 20)">
            <rect x="0" y="0" width="170" height="44" rx="22" fill="${secondary}" />
            <text x="85" y="27" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#090d16" text-anchor="middle">
              SHOP NOW →
            </text>
          </g>
        </g>

        <!-- Zero Humans Tag -->
        <text x="1000" y="1040" font-family="monospace" font-size="11" fill="#64748b" text-anchor="end">
          FEED POST 1:1 • STRICT ZERO-HUMANS GUARD
        </text>
      </svg>`;

    default:
      // General Medium Mockup (Bus Shelter, Subway, Packaging, Magazine, Storefront)
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
        <defs>
          <linearGradient id="defBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0b1120" />
            <stop offset="60%" stop-color="${primary}" />
            <stop offset="100%" stop-color="#020617" />
          </linearGradient>
        </defs>

        <rect width="1200" height="900" fill="url(#defBg)" />

        <!-- Display Showcase Frame -->
        <rect x="150" y="100" width="900" height="680" rx="20" fill="#090d16" stroke="${secondary}" stroke-width="4" opacity="0.9" />
        <rect x="180" y="130" width="840" height="620" rx="10" fill="#0f172a" />

        <!-- Interior Spotlight and Pedestal -->
        <ellipse cx="600" cy="620" rx="240" ry="40" fill="#1e293b" stroke="#334155" stroke-width="2" />
        
        <!-- Product -->
        <g transform="translate(520, 260)">
          <rect x="0" y="70" width="160" height="260" rx="22" fill="${primary}" stroke="${secondary}" stroke-width="3" />
          <path d="M 15,90 L 15,310" stroke="#ffffff" stroke-width="4" opacity="0.4" stroke-linecap="round" />
          <rect x="40" y="15" width="80" height="55" rx="8" fill="${secondary}" />
          <rect x="20" y="150" width="120" height="140" rx="8" fill="#ffffff" opacity="0.95" />
          <text x="80" y="200" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="#0f172a" text-anchor="middle">
            ${name.toUpperCase()}
          </text>
          <text x="80" y="225" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="${secondary}" text-anchor="middle">
            ${tagline.toUpperCase()}
          </text>
        </g>

        <!-- Typography in Showcase -->
        <text x="600" y="200" font-family="system-ui, sans-serif" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">
          ${name.toUpperCase()}
        </text>
        <text x="600" y="240" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="${secondary}" text-anchor="middle" letter-spacing="1.5">
          ${tagline.toUpperCase()}
        </text>

        <text x="600" y="710" font-family="system-ui, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">
          ADVERTISING MEDIUM: ${escapeXml(mediumId.toUpperCase())} • STRICTLY ZERO HUMANS
        </text>
      </svg>`;
  }
}
