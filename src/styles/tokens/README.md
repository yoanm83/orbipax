# Design Tokens

This directory contains documentation for OrbiPax's design token system using OKLCH color space and CSS custom properties.

## OKLCH Color System

### Why OKLCH?

OKLCH (Lightness, Chroma, Hue) provides several advantages over traditional hex/HSL colors:

- **Perceptual uniformity:** Equal numeric changes result in equal perceived color changes
- **Better accessibility:** Easier to maintain consistent contrast ratios across color variations
- **Wide gamut support:** Compatible with modern display technologies and future web standards
- **Predictable lightness:** Lightness values correspond to actual perceived brightness

### Token Structure

All color tokens follow this pattern in `src/styles/globals.css`:

```css
:root {
  --token-name: oklch(lightness% chroma hue);
}

.dark {
  --token-name: oklch(lightness% chroma hue); /* Dark mode override */
}
```

## Current Token Palette

### Background & Foreground
- `--bg`: Primary background color
- `--fg`: Primary text color
- `--muted`: Subtle background for secondary content
- `--muted-fg`: Muted text color

### Semantic Colors
- `--primary`: Brand primary color (interactive elements)
- `--primary-fg`: Text on primary backgrounds
- `--accent`: Accent color (highlights, success states)
- `--accent-fg`: Text on accent backgrounds
- `--destructive`: Error/danger color
- `--destructive-fg`: Text on destructive backgrounds

### UI Elements
- `--border`: Border color for components
- `--ring`: Focus ring color for accessibility
- `--focus`: Focus indicator color

### Typography Scale
- `--step--1`: Small text (0.83rem - 0.94rem fluid)
- `--step-0`: Base text (1.00rem - 1.13rem fluid)
- `--step-1`: Large text (1.20rem - 1.35rem fluid)
- `--step-2`: Heading text (1.44rem - 1.62rem fluid)

## Usage Rules

### ✅ Correct Usage

```tsx
// Use Tailwind classes that reference CSS variables
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">
    Primary Button
  </button>
</div>

// Use CSS variables directly when needed
<div style={{ backgroundColor: 'var(--accent)' }}>
  Custom styling
</div>
```

### ❌ Incorrect Usage

```tsx
// Never hardcode hex or RGB values
<div className="bg-[#3b82f6]">No!</div>
<div style={{ color: '#ef4444' }}>No!</div>

// Don't use arbitrary OKLCH values without tokens
<div className="bg-[oklch(50%_0.2_240)]">No!</div>
```

## Adding Brand Colors

When extending the palette for CMH-specific needs:

1. **Define semantic purpose:** What is this color for? (success, warning, info, etc.)
2. **Create light/dark pairs:** Ensure both modes are accessible
3. **Test contrast ratios:** Use tools like WebAIM to verify WCAG 2.2 AA compliance
4. **Update Tailwind config:** Add the new token to `tailwind.config.ts`

### Example: Adding a Warning Color

```css
/* In globals.css */
:root {
  --warning: oklch(75% 0.15 85);        /* Warm orange */
  --warning-fg: oklch(15% 0.05 85);     /* Dark text on warning */
}

.dark {
  --warning: oklch(65% 0.15 85);        /* Lighter orange for dark mode */
  --warning-fg: oklch(95% 0.02 85);     /* Light text on warning */
}
```

```ts
// In tailwind.config.ts
colors: {
  // ... existing colors
  warning: {
    DEFAULT: "var(--warning)",
    foreground: "var(--warning-fg)",
  },
}
```

## Accessibility Considerations

- **Minimum contrast:** All text/background combinations meet WCAG 2.2 AA (4.5:1 for normal text)
- **Focus indicators:** Focus rings use `--focus` token with 3:1 contrast minimum
- **Dark mode:** All tokens have appropriate dark mode overrides
- **Motion:** Respects `prefers-reduced-motion` for animations

## Responsive Breakpoints

OrbiPax uses a comprehensive breakpoint system optimized for CMH applications:

```css
'sm': '640px',   // Mobile/Tablet portrait
'md': '768px',   // Tablet landscape
'lg': '1024px',  // Small desktop
'xl': '1280px',  // Standard laptop
'2xl': '1600px', // Desktop standard (recommended)
'3xl': '1920px', // Large desktop
'4xl': '2560px', // 4K displays
```

### Usage in Components

```tsx
// Responsive text sizing
<h1 className="text-step-1 md:text-step-2 3xl:text-step-3">
  Responsive Heading
</h1>

// Responsive layouts
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
  {/* Cards adapt to screen size */}
</div>

// Responsive spacing
<section className="p-4 md:p-8 xl:p-12 3xl:p-16">
  Content with increasing padding
</section>
```

## Tools & Resources

- **OKLCH Color Picker:** https://oklch.com/
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Color Palette Generator:** https://www.realtimecolors.com/
- **OKLCH Documentation:** https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch

## Migration from Existing Colors

When migrating from hex/HSL colors:

1. **Convert to OKLCH:** Use online tools or design software
2. **Test in both modes:** Verify light and dark theme appearance
3. **Validate accessibility:** Check all contrast combinations
4. **Update gradually:** Convert one semantic group at a time

Remember: **Never hardcode colors in components.** Always use the token system for maintainable, accessible, and themeable interfaces.