# OrbiPax Assets

Static assets for the OrbiPax application organized by type and usage.

## Directory Structure

```
public/assets/
├── logos/          # Brand logos and wordmarks
│   ├── orbipax-logo.svg         # Main logo (light theme)
│   ├── orbipax-logo-dark.svg    # Main logo (dark theme)
│   ├── orbipax-icon.svg         # Icon/symbol only
│   ├── orbipax-wordmark.svg     # Text-only logo
│   └── orbipax-full.svg         # Complete brand mark
├── images/         # General images and graphics
│   ├── og-image.png             # Open Graph image (1200x630)
│   ├── hero-bg.webp             # Hero section background
│   ├── illustrations/           # Custom illustrations
│   └── screenshots/             # Product screenshots
└── icons/          # Icon collections
    ├── social/                  # Social media icons
    │   ├── twitter.svg
    │   ├── linkedin.svg
    │   └── github.svg
    └── ui/                      # UI/interface icons
        ├── arrow-right.svg
        ├── check.svg
        └── external-link.svg
```

## Usage Guidelines

### Logos
- Use `orbipax-logo.svg` for light backgrounds
- Use `orbipax-logo-dark.svg` for dark backgrounds
- Minimum size: 120px width
- Maintain aspect ratio
- Clear space: minimum 1x logo height on all sides

### Images
- Optimize all images for web (WebP preferred)
- Include alt text for accessibility
- Open Graph images: 1200x630px
- Hero images: optimize for Core Web Vitals

### Icons
- SVG format preferred for scalability
- Consistent stroke width (1.5px recommended)
- 24x24px artboard for UI icons
- Use semantic naming

## File Naming Convention

- Use kebab-case: `orbipax-logo-dark.svg`
- Include variant suffixes: `-dark`, `-light`, `-outline`
- Be descriptive: `hero-background-gradient.webp`
- Version control: `logo-v2.svg` if needed

## Optimization

All assets should be optimized before deployment:
- SVGs: Remove unnecessary metadata
- Images: Compress for web (WebP, AVIF)
- Icons: Minify and optimize paths
- Favicons: Generate all required sizes

## Access from Code

```typescript
// Direct path (recommended)
<img src="/assets/logos/orbipax-logo.svg" alt="OrbiPax" />

// Next.js Image component
import Image from 'next/image';
<Image
  src="/assets/images/hero-bg.webp"
  alt="Background"
  width={1200}
  height={600}
/>

// Dynamic imports (if needed)
import logo from '/assets/logos/orbipax-logo.svg';
```

## Favicon Files

Favicon files should be placed directly in `/public/`:
- `favicon.ico` (16x16, 32x32, 48x48)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
- `site.webmanifest`

## Notes

- This directory is served statically by Next.js
- All files are publicly accessible via `/assets/...`
- No processing or bundling occurs
- Perfect for images, logos, and static resources
- Compatible with CDN deployment