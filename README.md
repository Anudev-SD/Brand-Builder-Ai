Brand Builder — AI Product Mockup & Campaign Studio
Create a consistent product identity and generate AI-powered advertising mockups for multiple marketing channels from one workspace.

Brand Builder is a web application built with React, TypeScript, Express, and Google's Gemini API. It helps users define a product's visual identity, create or upload a master product image, and generate campaign visuals for different advertising formats while keeping the product description, colors, and visual direction consistent.
Features
- Product Blueprint: Define the product name, category, tagline, description, colors, materials, and brand aesthetic.
- Preset Inspirations: Start quickly with sample product profiles for matcha, skincare, watches, cold brew, and headphones.
- AI Brand Polish: Use Gemini to refine product descriptions and visual details for more consistent image-generation prompts.
- Canonical Master Packshot: Generate a square product hero image to use as a visual reference for campaign assets, or upload an existing product image.
- Multi-medium Mockups: Generate campaign visuals for eight formats:
  - Highway / skyline billboard
  - Broadsheet newspaper print ad
  - Social media feed post
  - Transit shelter poster
  - Subway platform lightbox
  - Luxury box and unboxing
  - Glossy editorial spread
  - Storefront window display
- Batch Generation: Select multiple media formats and generate a set of campaign visuals.
- Custom Art Direction: Add notes for a particular medium to guide the generated image.
- Inspect and Compare: Preview generated assets and compare them with the master product reference.
- Download Images: Download generated images from the interface.
- Model Selection: The backend supports the default gemini-3.1-flash-lite-image model and the higher-quality gemini-nano-banana-2.1 option.
- Responsive Interface: A dark, studio-style UI built with Tailwind CSS and Lucide icons.
Generated images and model availability depend on the Gemini API, the model access available to your API key, and API usage limits.

How It Works
1. Enter product details or select a sample preset.
2. Optionally use AI Brand Polish to refine the product description.
3. Generate a master packshot or upload an existing product image.
4. Select the advertising formats you want to create.
5. Add any medium-specific art direction notes.
6. Generate one asset or batch-generate selected formats.
7. Inspect, compare, and download the resulting images.
The master packshot is passed to the image-generation workflow as a reference when generating medium-specific assets. The backend combines product information, medium-specific prompt templates, aspect-ratio settings, optional notes, and the reference image where available.
Technology Stack
Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Lucide React
- Motion
Backend and AI
- Node.js
- Express
- TypeScript, executed with tsx
- Google GenAI SDK (@google/genai)
- Google Gemini models for text refinement and image generation
- dotenv for environment configuration
Image Mockup Utility
- TypeScript-generated SVG mockups in src/server/vectorMockup.ts
Project Structure
brand-builder/
├── index.html
├── package.json
├── server.ts
├── vite.config.ts
├── tsconfig.json
├── .env.example
├── .gitignore
├── README.md
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── types.ts
    ├── data/
    │   └── presets.ts
    ├── components/
    │   ├── Navbar.tsx
    │   ├── ProductSpecifier.tsx
    │   ├── MasterShotStudio.tsx
    │   ├── MediumGrid.tsx
    │   └── Modals.tsx
    └── server/
        └── vectorMockup.ts
Main Files
- src/App.tsx — Coordinates product state, generation requests, loading states, image previews, and notifications.
- src/components/ProductSpecifier.tsx — Product details, sample presets, and AI brand-polish controls.
- src/components/MasterShotStudio.tsx — Master image generation, custom image upload, preview, and download.
- src/components/MediumGrid.tsx — Medium selection, batch generation, custom art direction, previews, and downloads.
- src/components/Modals.tsx — Image inspection and comparison dialogs.
- src/data/presets.ts — Sample product profiles and advertising-medium definitions.
- src/types.ts — TypeScript interfaces for products, media, presets, and generated shots.
- server.ts — Express API, Gemini integration, prompt templates, and Vite development/production serving.
- src/server/vectorMockup.ts — Utilities for generating SVG-based product and medium mockups.
Prerequisites
- Node.js (use a current LTS release)
- npm
- A Google Gemini API key with access to the models used by the application
- Internet access for API calls
Run Locally
1. Get the code
Clone your repository:
git clone <YOUR_REPOSITORY_URL>
cd brand-builder
Or extract the ZIP archive and open the extracted project directory in VS Code.
2. Install dependencies
From the project root, run:
npm install
3. Configure the API key
Create a .env file in the project root. You can use .env.example as a reference.
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
Get a key from Google AI Studio. Replace the example value with your own key.

Keep the key private. Do not put it in frontend code or commit your .env file to GitHub. The supplied .gitignore excludes .env files while allowing .env.example.

The .env.example file also mentions APP_URL, which may be relevant to a hosted environment. It is not required for the basic local workflow described here.
4. Start the development server
npm run dev
Open http://localhost:3000 in your browser. Keep the terminal open while using the application. Press Ctrl+C in the terminal to stop the server.
Available Commands
Command	Purpose
npm install	Install dependencies
npm run dev	Run the Express server with Vite development middleware
npm run build	Build the frontend into dist/
npm start	Start the Express server; set NODE_ENV=production for production serving
npm run preview	Preview the Vite build separately
npm run lint	Run TypeScript checking with tsc --noEmit
npm run clean	Remove the dist directory and server.js if present


API Endpoints
The Express backend exposes the following endpoints.
GET /api/health
Returns service status, whether a Gemini API key is configured, model names, and the supported advertising-medium configurations.
POST /api/refine-product
Uses Gemini to refine product details into a more consistent description for image generation.

The request can include product name, category, a rough idea, primary and secondary colors, and materials.
POST /api/generate-master
Generates a square master product image from the product details using a selected image model. The returned image is used as the main visual anchor for later mockups.
POST /api/generate-medium
Generates an image for a selected advertising medium. The request includes the medium ID, product information, optional reference image, optional custom notes, and model selection.

Supported medium IDs include billboard, newspaper, social_post, bus_shelter, subway, packaging, magazine, and storefront.

For implementation details and request payloads, see the corresponding route handlers in server.ts.
Production Build
Build the frontend:
npm run build
Then start the server in production mode:
NODE_ENV=production npm start
Ensure the deployment environment has GEMINI_API_KEY configured and that the dist/ directory exists. The Express server serves the built frontend in production mode.

For deployment, use a Node.js-compatible hosting service, keep API keys in its secret/environment-variable settings, and configure HTTPS and appropriate usage limits.
Troubleshooting
The app says the API key is missing
- Check that .env is in the project root, beside package.json.
- Confirm the variable is named GEMINI_API_KEY.
- Restart the development server after changing environment variables.
Image generation fails
- Confirm the API key is valid and has access to the requested model.
- Check your internet connection, provider status, quota, and billing or usage limits.
- Review the terminal output for the server-side error message.
npm or node is not found
Install Node.js from nodejs.org, then restart the terminal and check node -v and npm -v.
Port 3000 is busy
Try another port:
PORT=3001 npm run dev
Then open http://localhost:3001.
TypeScript check fails
Run:
npm run lint
Review the reported file and line numbers. The command checks TypeScript types; it is not a full automated test suite.
Notes and Limitations
- Generated images require calls to the external Gemini API and may incur usage according to your Google AI account.
- Output quality, aspect ratios, and model availability depend on the selected model and provider support.
- AI-generated text and images may contain inaccuracies or unexpected visual details; review assets before publishing.
- The project does not define a database-backed asset library or user authentication in the supplied source. Save downloaded images somewhere safe if you need a durable archive.
- No explicit open-source license is declared in the supplied project files. Add a LICENSE file if you intend to publish the project under a particular license.
Future Improvements
Potential extensions include:
- Persistent project and asset history
- User accounts and team collaboration
- Brand kits that can be reused across campaigns
- More export formats and campaign bundles
- Automated visual consistency checks
- Unit and integration tests
- Deployment-specific security, request limits, and monitoring
These are possible future enhancements, not claims about existing functionality.
Brand Builder — Define a product. Lock its visual identity. Create a campaign across multiple mediums.
