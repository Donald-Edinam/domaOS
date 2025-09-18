# TASA Orbiter Font Setup

## Current Setup
Your application is currently using **Inter** as a high-quality alternative to TASA Orbiter. Inter has similar modern, geometric characteristics and excellent readability.

## To Add TASA Orbiter Font

### Step 1: Obtain the Font
Purchase/license TASA Orbiter from:
- [TASA Type Foundry](https://www.tasa.type/)
- [Fontstand](https://fontstand.com/) (for testing)
- [MyFonts](https://www.myfonts.com/)

### Step 2: Add Font Files
Add the following files to this directory:
- `TASAOrbiterVF.woff2` (Variable font - recommended)

Or individual weight files:
- `TASAOrbiter-Light.woff2` (300)
- `TASAOrbiter-Regular.woff2` (400) 
- `TASAOrbiter-Medium.woff2` (500)
- `TASAOrbiter-Semibold.woff2` (600)
- `TASAOrbiter-Bold.woff2` (700)
- `TASAOrbiter-Heavy.woff2` (800)
- `TASAOrbiter-Black.woff2` (900)

### Step 3: Update Configuration
Once you have the font file, update `src/app/layout.tsx`:

```typescript
import localFont from "next/font/local";

const tasaOrbiter = localFont({
  src: [
    {
      path: "../../public/fonts/TASAOrbiterVF.woff2",
      style: "normal",
    },
  ],
  variable: "--font-tasa-orbiter",
  fallback: ["Inter", "SF Pro Display", "system-ui", "sans-serif"],
  display: "swap",
});

// Then update the body className to use: font-tasa
```

### Step 4: Update CSS
Update `src/index.css` to use TASA Orbiter:

```css
@theme {
  --font-sans: var(--font-tasa-orbiter), "TASA Orbiter", "Inter", "SF Pro Display", sans-serif;
}
```

## Font Conversion
If you have .ttf or .otf files, convert to .woff2 for better web performance:
- [Fontsquirrel Webfont Generator](https://www.fontsquirrel.com/tools/webfont-generator)
- [Cloudconvert](https://cloudconvert.com/ttf-to-woff2)

## Current Typography Features
The application is already optimized for TASA Orbiter with:
- ✅ Font weight variations (300-900)
- ✅ Letter spacing adjustments
- ✅ Optimized line heights
- ✅ Gradient text effects
- ✅ Proper fallback fonts
