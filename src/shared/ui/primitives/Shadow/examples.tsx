"use client";

import { useState } from "react";

import { Button } from "../Button";
import { useToast } from "../Toast";

import { Shadow } from "./index";

// Example 1: Basic Shadow Elevations
export function ShadowElevationsExample() {
  const { info } = useToast();

  const handleClick = (elevation: number) => {
    info("Shadow Level", `Clicked element with elevation ${elevation}`);
  };

  return (
    <div className="space-y-6 w-full max-w-2xl">
      <h4 className="text-sm font-medium text-fg">Elevation Levels (0-6)</h4>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[0, 1, 2, 3, 4, 5, 6].map((elevation) => (
          <div key={elevation} className="text-center space-y-3">
            <Shadow
              elevation={elevation as 0 | 1 | 2 | 3 | 4 | 5 | 6}
              animated
              hover
              className="bg-card border border-border rounded-lg p-4 cursor-pointer"
              onClick={() => handleClick(elevation)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClick(elevation);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="text-sm font-medium text-fg">Level {elevation}</div>
              <div className="text-xs text-on-muted mt-1">
                {elevation === 0 && "No shadow"}
                {elevation === 1 && "Subtle"}
                {elevation === 2 && "Light"}
                {elevation === 3 && "Medium"}
                {elevation === 4 && "Strong"}
                {elevation === 5 && "Heavy"}
                {elevation === 6 && "Maximum"}
              </div>
            </Shadow>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 2: Shadow Variants
export function ShadowVariantsExample() {
  const variants = [
    { variant: "none" as const, label: "None", description: "No shadow" },
    { variant: "subtle" as const, label: "Subtle", description: "Light shadow" },
    { variant: "moderate" as const, label: "Moderate", description: "Medium shadow" },
    { variant: "strong" as const, label: "Strong", description: "Heavy shadow" }
  ];

  return (
    <div className="space-y-6 w-full max-w-lg">
      <h4 className="text-sm font-medium text-fg">Shadow Variants</h4>

      <div className="grid grid-cols-2 gap-4">
        {variants.map(({ variant, label, description }) => (
          <div key={variant} className="text-center space-y-3">
            <Shadow
              variant={variant}
              animated
              hover
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="text-sm font-medium text-fg">{label}</div>
              <div className="text-xs text-on-muted mt-1">{description}</div>
            </Shadow>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 3: Colored Shadows
export function ColoredShadowsExample() {
  const colors = [
    { color: "neutral" as const, label: "Neutral", bgClass: "bg-neutral-50" },
    { color: "primary" as const, label: "Primary", bgClass: "bg-primary/5" },
    { color: "success" as const, label: "Success", bgClass: "bg-success/5" },
    { color: "warning" as const, label: "Warning", bgClass: "bg-warning/5" },
    { color: "error" as const, label: "Error", bgClass: "bg-error/5" }
  ];

  return (
    <div className="space-y-6 w-full max-w-2xl">
      <h4 className="text-sm font-medium text-fg">Colored Shadows</h4>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {colors.map(({ color, label, bgClass }) => (
          <div key={color} className="text-center space-y-3">
            <Shadow
              elevation={3}
              color={color}
              animated
              hover
              className={`${bgClass} border border-border rounded-lg p-4`}
            >
              <div className="text-sm font-medium text-fg">{label}</div>
              <div className="text-xs text-on-muted mt-1">
                {color} colored shadow
              </div>
            </Shadow>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 4: Inset Shadows
export function InsetShadowsExample() {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = ["Profile", "Settings", "Billing", "Security"];

  return (
    <div className="space-y-6 w-full max-w-lg">
      <h4 className="text-sm font-medium text-fg">Inset Shadows</h4>

      <div className="space-y-4">
        <div className="bg-muted rounded-lg p-1 flex">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(index)}
              className="flex-1 text-center py-2 px-4 text-sm font-medium rounded-md transition-all duration-200"
            >
              <Shadow
                elevation={selectedTab === index ? 2 : 0}
                inset={selectedTab !== index}
                animated
                className={`
                  w-full h-full rounded-md
                  ${selectedTab === index
                    ? "bg-card text-fg"
                    : "text-on-muted hover:text-fg"
                  }
                `}
              >
                <div className="py-1">{tab}</div>
              </Shadow>
            </button>
          ))}
        </div>

        <Shadow
          elevation={1}
          inset
          className="bg-muted rounded-lg p-6"
        >
          <div className="text-sm text-fg">
            <strong>Inset shadows</strong> create the appearance of depth going inward,
            perfect for form inputs, pressed buttons, or recessed areas.
          </div>
        </Shadow>
      </div>
    </div>
  );
}

// Example 5: Interactive Shadow States
export function InteractiveShadowsExample() {
  const { info } = useToast();
  const [isPressed, setIsPressed] = useState(false);

  const handleInteraction = (type: string) => {
    info("Interaction", `${type} interaction detected`);
  };

  return (
    <div className="space-y-6 w-full max-w-lg">
      <h4 className="text-sm font-medium text-fg">Interactive Shadow States</h4>

      <div className="space-y-4">
        <div className="space-y-2">
          <span className="text-xs font-medium text-on-muted">Hover Effects</span>
          <Shadow
            elevation={2}
            hover
            animated
            className="bg-card border border-border rounded-lg p-4 cursor-pointer"
            onClick={() => handleInteraction("Click")}
          >
            <div className="text-sm font-medium text-fg">Hover for elevation</div>
            <div className="text-xs text-on-muted mt-1">
              Shadow increases on hover
            </div>
          </Shadow>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-medium text-on-muted">Focus Effects</span>
          <Shadow
            elevation={1}
            focus
            animated
            className="bg-card border border-border rounded-lg"
          >
            <input
              type="text"
              placeholder="Focus me for shadow effect"
              className="w-full p-4 bg-transparent text-sm text-fg placeholder-on-muted outline-none"
              onFocus={() => handleInteraction("Focus")}
              onBlur={() => handleInteraction("Blur")}
            />
          </Shadow>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-medium text-on-muted">Press Effects</span>
          <Shadow
            elevation={isPressed ? 0 : 3}
            animated
            className="bg-card border border-border rounded-lg cursor-pointer select-none"
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            onClick={() => handleInteraction("Press")}
          >
            <div className="p-4">
              <div className="text-sm font-medium text-fg">
                {isPressed ? "Pressed!" : "Click and hold"}
              </div>
              <div className="text-xs text-on-muted mt-1">
                Shadow disappears when pressed
              </div>
            </div>
          </Shadow>
        </div>
      </div>
    </div>
  );
}

// Example 6: Utility Shadow Components
export function UtilityShadowsExample() {
  const { info } = useToast();

  const handleUtilityClick = (type: string) => {
    info("Utility Component", `Clicked ${type} component`);
  };

  return (
    <div className="space-y-6 w-full max-w-lg">
      <h4 className="text-sm font-medium text-fg">Utility Shadow Components</h4>

      <div className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-medium text-on-muted">Shadow.Card</span>
          <Shadow.Card
            variant="elevated"
            onClick={() => handleUtilityClick("Card")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleUtilityClick("Card");
              }
            }}
            role="button"
            tabIndex={0}
            className="p-4 cursor-pointer"
          >
            <div className="text-sm font-medium text-fg">Elevated Card</div>
            <div className="text-xs text-on-muted mt-1">
              Pre-configured card with hover effects
            </div>
          </Shadow.Card>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-medium text-on-muted">Shadow.Modal</span>
          <Shadow.Modal className="p-6 max-w-sm mx-auto">
            <div className="text-sm font-medium text-fg">Modal Content</div>
            <div className="text-xs text-on-muted mt-2">
              High elevation shadow for modal dialogs
            </div>
            <Button
              size="sm"
              className="mt-3"
              onClick={() => handleUtilityClick("Modal")}
            >
              Action
            </Button>
          </Shadow.Modal>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-medium text-on-muted">Shadow.Dropdown</span>
          <Shadow.Dropdown className="p-3 max-w-48">
            <div className="space-y-1">
              <div
                className="text-sm text-fg hover:bg-accent rounded px-2 py-1 cursor-pointer"
                onClick={() => handleUtilityClick("Dropdown Item 1")}
              >
                Option 1
              </div>
              <div
                className="text-sm text-fg hover:bg-accent rounded px-2 py-1 cursor-pointer"
                onClick={() => handleUtilityClick("Dropdown Item 2")}
              >
                Option 2
              </div>
              <div
                className="text-sm text-fg hover:bg-accent rounded px-2 py-1 cursor-pointer"
                onClick={() => handleUtilityClick("Dropdown Item 3")}
              >
                Option 3
              </div>
            </div>
          </Shadow.Dropdown>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-medium text-on-muted">Shadow.FloatingPanel</span>
          <Shadow.FloatingPanel
            className="p-4 cursor-pointer"
            onClick={() => handleUtilityClick("Floating Panel")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleUtilityClick("Floating Panel");
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="text-sm font-medium text-fg">Floating Panel</div>
            <div className="text-xs text-on-muted mt-1">
              Interactive floating element with hover elevation
            </div>
          </Shadow.FloatingPanel>
        </div>
      </div>
    </div>
  );
}

// Example 7: Shadow Performance Demo
export function ShadowPerformanceExample() {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const { info } = useToast();

  const toggleAnimations = () => {
    setAnimationsEnabled(!animationsEnabled);
    info(
      "Animations",
      `Animations ${!animationsEnabled ? "enabled" : "disabled"}`
    );
  };

  return (
    <div className="space-y-6 w-full max-w-lg">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-fg">Performance & Accessibility</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAnimations}
        >
          {animationsEnabled ? "Disable" : "Enable"} Animations
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Shadow
              key={i}
              elevation={2}
              animated={animationsEnabled}
              hover={animationsEnabled}
              className="bg-card border border-border rounded-lg p-3 cursor-pointer"
              onClick={() => info("Performance", `Clicked optimized shadow ${i}`)}
            >
              <div className="text-xs font-medium text-fg">Item {i}</div>
              <div className="text-xs text-on-muted">
                {animationsEnabled ? "Animated" : "Static"}
              </div>
            </Shadow>
          ))}
        </div>

        <div className="bg-muted rounded-lg p-4 text-xs text-on-muted">
          <div className="font-medium text-fg mb-2">Performance Notes:</div>
          <ul className="space-y-1 text-xs">
            <li>• Animations respect <code>prefers-reduced-motion</code></li>
            <li>• Shadows use GPU-accelerated properties</li>
            <li>• Hover effects are optimized with pseudo-elements</li>
            <li>• Smooth transitions improve perceived performance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}