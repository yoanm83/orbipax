"use client";

import { useState } from "react";

import { Button } from "../Button";
import { Card } from "../Card";
import { useToast } from "../Toast";

import { Typography } from "./index";
import type { TypographyVariants } from "./index";

// Example 1: Display Typography Showcase
export function DisplayTypographyExample() {
  const displaySizes = ["xl", "l", "m", "s"] as const;

  return (
    <div className="space-y-8 w-full">
      <Typography.Title size="m">Display Typography</Typography.Title>
      <Typography.Caption size="m" color="muted">
        Large, prominent text for hero sections and landing pages
      </Typography.Caption>

      <div className="space-y-6">
        {displaySizes.map((size) => (
          <div key={size} className="space-y-2">
            <Typography.Label size="s" color="muted">
              Display {size.toUpperCase()}
            </Typography.Label>
            <Typography.Display size={size}>
              OrbiPax Design System
            </Typography.Display>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 2: Headline Hierarchy
export function HeadlineHierarchyExample() {
  const headlineLevels = [1, 2, 3, 4, 5, 6] as const;

  return (
    <div className="space-y-8 w-full">
      <Typography.Title size="m">Headline Hierarchy</Typography.Title>
      <Typography.Caption size="m" color="muted">
        Semantic heading structure (H1-H6) with proper hierarchy
      </Typography.Caption>

      <div className="space-y-4">
        {headlineLevels.map((level) => (
          <div key={level} className="space-y-1">
            <Typography.Label size="s" color="muted">
              H{level} - Headline
            </Typography.Label>
            <Typography.Headline level={level}>
              This is a Headline Level {level}
            </Typography.Headline>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 3: Body Text Variations
export function BodyTextExample() {
  const bodySizes = ["l", "m", "s"] as const;

  const sampleText = "The five boxing wizards jump quickly. This is sample body text demonstrating readability and line height at different sizes. Perfect for content areas, articles, and general text blocks.";

  return (
    <div className="space-y-8 w-full max-w-3xl">
      <Typography.Title size="m">Body Text Variations</Typography.Title>
      <Typography.Caption size="m" color="muted">
        Different body text sizes for content hierarchy and readability
      </Typography.Caption>

      <div className="space-y-6">
        {bodySizes.map((size) => (
          <div key={size} className="space-y-2">
            <Typography.Label size="s" color="muted">
              Body {size.toUpperCase()} - {size === "l" ? "Large" : size === "m" ? "Medium" : "Small"}
            </Typography.Label>
            <Typography.Body size={size}>
              {sampleText}
            </Typography.Body>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 4: Color Variations
export function ColorVariationsExample() {
  const colors: Array<TypographyVariants["color"]> = ["default", "muted", "primary", "success", "warning", "error"];

  return (
    <div className="space-y-8 w-full">
      <Typography.Title size="m">Color Variations</Typography.Title>
      <Typography.Caption size="m" color="muted">
        Semantic color usage for different contexts and states
      </Typography.Caption>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {colors.map((color) => (
          <Card key={color} className="p-4">
            <div className="space-y-2">
              <Typography.Label size="s" color="muted">
                {color.charAt(0).toUpperCase() + color.slice(1)} Color
              </Typography.Label>
              <Typography.Body size="m" color={color}>
                This text demonstrates the {color} color variant for typography components.
              </Typography.Body>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Example 5: Weight Variations
export function WeightVariationsExample() {
  const weights: Array<TypographyVariants["weight"]> = ["light", "regular", "medium", "semibold", "bold"];

  return (
    <div className="space-y-8 w-full">
      <Typography.Title size="m">Font Weight Variations</Typography.Title>
      <Typography.Caption size="m" color="muted">
        Different font weights for emphasis and hierarchy
      </Typography.Caption>

      <div className="space-y-4">
        {weights.map((weight) => (
          <div key={weight} className="space-y-2">
            <Typography.Label size="s" color="muted">
              {weight.charAt(0).toUpperCase() + weight.slice(1)} Weight
            </Typography.Label>
            <Typography.Body size="m" weight={weight}>
              The quick brown fox jumps over the lazy dog - {weight} weight
            </Typography.Body>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 6: Alignment Variations
export function AlignmentExample() {
  const alignments: Array<TypographyVariants["align"]> = ["left", "center", "right", "justify"];

  const sampleText = "Typography alignment affects readability and visual balance. This sample text demonstrates different alignment options available in the design system.";

  return (
    <div className="space-y-8 w-full max-w-2xl">
      <Typography.Title size="m">Text Alignment</Typography.Title>
      <Typography.Caption size="m" color="muted">
        Different text alignment options for layout flexibility
      </Typography.Caption>

      <div className="space-y-6">
        {alignments.map((align) => (
          <div key={align} className="space-y-2">
            <Typography.Label size="s" color="muted">
              {align.charAt(0).toUpperCase() + align.slice(1)} Aligned
            </Typography.Label>
            <div className="border border-border rounded-md p-4">
              <Typography.Body size="m" align={align}>
                {sampleText}
              </Typography.Body>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 7: Label and Caption Usage
export function LabelCaptionExample() {
  const { success } = useToast();

  const handleSubmit = () => {
    success("Form", "Form submitted successfully");
  };

  return (
    <div className="space-y-8 w-full max-w-md">
      <Typography.Title size="m">Labels and Captions</Typography.Title>
      <Typography.Caption size="m" color="muted">
        Small text for UI elements, forms, and supplementary information
      </Typography.Caption>

      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <Typography.Label size="m" weight="medium">
            Email Address
          </Typography.Label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your email"
          />
          <Typography.Caption size="s" color="muted">
            We'll never share your email with anyone else.
          </Typography.Caption>
        </div>

        <div className="space-y-2">
          <Typography.Label size="m" weight="medium">
            Password
          </Typography.Label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your password"
          />
          <Typography.Caption size="s" color="error">
            Password must be at least 8 characters long.
          </Typography.Caption>
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Submit Form
        </Button>
      </Card>
    </div>
  );
}

// Example 8: Article Layout Example
export function ArticleLayoutExample() {
  return (
    <div className="space-y-8 w-full max-w-4xl">
      <Typography.Title size="m">Article Layout</Typography.Title>
      <Typography.Caption size="m" color="muted">
        Demonstrating typography hierarchy in a real article layout
      </Typography.Caption>

      <article className="space-y-6 bg-card border border-border rounded-lg p-8">
        <header className="space-y-4">
          <Typography.Display size="m">
            The Future of Design Systems
          </Typography.Display>
          <Typography.Caption size="l" color="muted">
            Published on March 15, 2025 • 5 min read
          </Typography.Caption>
        </header>

        <Typography.Body size="l" color="muted">
          Design systems have evolved significantly over the past decade, transforming from simple style guides to comprehensive ecosystems that power entire product experiences.
        </Typography.Body>

        <section className="space-y-4">
          <Typography.Headline level={2}>
            The Evolution of Typography
          </Typography.Headline>

          <Typography.Body size="m">
            Typography forms the backbone of any design system. Modern approaches emphasize semantic meaning over visual appearance, creating more maintainable and accessible experiences. The shift towards design tokens has enabled teams to create more flexible and scalable typography systems.
          </Typography.Body>

          <Typography.Body size="m">
            By implementing fluid typography with CSS clamp(), we can create responsive text that adapts seamlessly across different screen sizes without the need for multiple media queries.
          </Typography.Body>
        </section>

        <section className="space-y-4">
          <Typography.Headline level={3}>
            Key Benefits
          </Typography.Headline>

          <ul className="space-y-2 ml-6">
            <li>
              <Typography.Body size="m">
                <strong>Consistency:</strong> Unified typography across all touchpoints
              </Typography.Body>
            </li>
            <li>
              <Typography.Body size="m">
                <strong>Accessibility:</strong> Improved readability and screen reader support
              </Typography.Body>
            </li>
            <li>
              <Typography.Body size="m">
                <strong>Maintainability:</strong> Centralized control of typographic decisions
              </Typography.Body>
            </li>
          </ul>
        </section>

        <footer className="pt-6 border-t border-border">
          <Typography.Caption size="m" color="muted">
            Learn more about implementing design systems in your organization.
          </Typography.Caption>
        </footer>
      </article>
    </div>
  );
}

// Example 9: Interactive Typography Playground
export function TypographyPlaygroundExample() {
  const [selectedVariant, setSelectedVariant] = useState<TypographyVariants["variant"]>("body-m");
  const [selectedWeight, setSelectedWeight] = useState<TypographyVariants["weight"]>("regular");
  const [selectedAlign, setSelectedAlign] = useState<TypographyVariants["align"]>("left");
  const [selectedColor, setSelectedColor] = useState<TypographyVariants["color"]>("default");

  const variants: Array<TypographyVariants["variant"]> = [
    "display-xl", "display-l", "headline-h1", "headline-h2", "title-l",
    "body-l", "body-m", "label-m", "caption-m"
  ];

  const weights: Array<TypographyVariants["weight"]> = ["light", "regular", "medium", "semibold", "bold"];
  const alignments: Array<TypographyVariants["align"]> = ["left", "center", "right"];
  const colors: Array<TypographyVariants["color"]> = ["default", "muted", "primary", "success", "warning", "error"];

  return (
    <div className="space-y-8 w-full max-w-4xl">
      <Typography.Title size="m">Typography Playground</Typography.Title>
      <Typography.Caption size="m" color="muted">
        Interactive playground to experiment with different typography combinations
      </Typography.Caption>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-4 space-y-4">
            <Typography.Label size="m" weight="medium">Controls</Typography.Label>

            <div className="space-y-2">
              <Typography.Label size="s">Variant</Typography.Label>
              <select
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value as TypographyVariants["variant"])}
                className="w-full px-3 py-2 border border-border rounded-md text-sm"
              >
                {variants.map((variant) => (
                  <option key={variant} value={variant}>
                    {variant}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Typography.Label size="s">Weight</Typography.Label>
              <select
                value={selectedWeight}
                onChange={(e) => setSelectedWeight(e.target.value as TypographyVariants["weight"])}
                className="w-full px-3 py-2 border border-border rounded-md text-sm"
              >
                {weights.map((weight) => (
                  <option key={weight} value={weight}>
                    {weight}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Typography.Label size="s">Alignment</Typography.Label>
              <select
                value={selectedAlign}
                onChange={(e) => setSelectedAlign(e.target.value as TypographyVariants["align"])}
                className="w-full px-3 py-2 border border-border rounded-md text-sm"
              >
                {alignments.map((align) => (
                  <option key={align} value={align}>
                    {align}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Typography.Label size="s">Color</Typography.Label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value as TypographyVariants["color"])}
                className="w-full px-3 py-2 border border-border rounded-md text-sm"
              >
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <Card className="p-8 min-h-64 flex items-center justify-center">
            <Typography
              variant={selectedVariant}
              weight={selectedWeight}
              align={selectedAlign}
              color={selectedColor}
            >
              The quick brown fox jumps over the lazy dog. This is sample text for the typography playground.
            </Typography>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Example 10: Responsive Typography Demo
export function ResponsiveTypographyExample() {
  return (
    <div className="space-y-8 w-full">
      <Typography.Title size="m">Responsive Typography</Typography.Title>
      <Typography.Caption size="m" color="muted">
        Typography that adapts fluidly across different screen sizes using CSS clamp()
      </Typography.Caption>

      <div className="space-y-8">
        <Card className="p-6 space-y-4">
          <Typography.Label size="m" weight="medium" color="primary">
            Mobile → Desktop Scaling
          </Typography.Label>
          <Typography.Display size="xl">
            Fluid Typography
          </Typography.Display>
          <Typography.Caption size="s" color="muted">
            This text scales automatically from 56px on mobile to 96px on desktop
          </Typography.Caption>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <Typography.Headline level={2}>
              Semantic Scaling
            </Typography.Headline>
            <Typography.Body size="m">
              All typography components use semantic tokens that automatically scale based on viewport size, ensuring optimal readability across all devices.
            </Typography.Body>
          </Card>

          <Card className="p-6 space-y-4">
            <Typography.Headline level={3}>
              Performance Benefits
            </Typography.Headline>
            <Typography.Body size="m">
              CSS clamp() eliminates the need for multiple media queries, reducing CSS bundle size and improving performance.
            </Typography.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}