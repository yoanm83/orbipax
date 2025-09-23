"use client";

import { useState } from "react";

import { useToast } from "../Toast";

import { Toggle } from "./index";

// Example 1: Basic Toggle Variants
export function BasicToggleExample() {
  const { info } = useToast();
  const [isPressed, setIsPressed] = useState(false);

  const handleToggleChange = (pressed: boolean) => {
    setIsPressed(pressed);
    info("Toggle State", `Toggle is now ${pressed ? "pressed" : "not pressed"}`);
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Basic Toggle</h4>

      <div className="space-y-4">
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-on-muted">Controlled Toggle</h5>
          <div className="flex items-center space-x-4">
            <Toggle
              pressed={isPressed}
              onPressedChange={handleToggleChange}
              aria-label="Bold text"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
              Bold
            </Toggle>
            <span className="text-xs text-on-muted">
              State: {isPressed ? "Pressed" : "Not pressed"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h5 className="text-xs font-medium text-on-muted">Uncontrolled Toggle</h5>
          <Toggle
            defaultPressed={false}
            aria-label="Italic text"
            onPressedChange={(pressed) => info("Italic", `Italic ${pressed ? "enabled" : "disabled"}`)}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            Italic
          </Toggle>
        </div>
      </div>
    </div>
  );
}

// Example 2: Toggle Sizes
export function ToggleSizesExample() {
  const sizes: Array<"sm" | "md" | "lg"> = ["sm", "md", "lg"];

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Toggle Sizes</h4>

      <div className="flex items-center space-x-4">
        {sizes.map((size) => (
          <div key={size} className="text-center space-y-2">
            <Toggle
              size={size}
              defaultPressed={false}
              aria-label={`${size} toggle`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {size.toUpperCase()}
            </Toggle>
            <span className="text-xs text-on-muted">{size}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 3: Toggle Variants
export function ToggleVariantsExample() {
  const variants: Array<"default" | "outline" | "ghost" | "soft"> = ["default", "outline", "ghost", "soft"];

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Toggle Variants</h4>

      <div className="space-y-4">
        {variants.map((variant) => (
          <div key={variant} className="space-y-2">
            <h5 className="text-xs font-medium text-on-muted capitalize">{variant}</h5>
            <div className="flex items-center space-x-2">
              <Toggle
                variant={variant}
                defaultPressed={false}
                aria-label={`${variant} toggle not pressed`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Edit
              </Toggle>
              <Toggle
                variant={variant}
                defaultPressed={true}
                aria-label={`${variant} toggle pressed`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save
              </Toggle>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 4: Icon-only Toggles
export function IconToggleExample() {
  const { info } = useToast();

  const handleToggle = (action: string, pressed: boolean) => {
    info("Format Toggle", `${action} ${pressed ? "enabled" : "disabled"}`);
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Formatting Toolbar</h4>

      <div className="flex items-center space-x-1 p-2 border border-border rounded-lg">
        <Toggle
          size="sm"
          variant="ghost"
          aria-label="Bold"
          onPressedChange={(pressed) => handleToggle("Bold", pressed)}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h4m0 0V8a4 4 0 118 0v4m-8 0l4 4m0-4H8a4 4 0 01-4-4v0a4 4 0 014-4h4m0 0V4"
            />
          </svg>
        </Toggle>

        <Toggle
          size="sm"
          variant="ghost"
          aria-label="Italic"
          onPressedChange={(pressed) => handleToggle("Italic", pressed)}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        </Toggle>

        <Toggle
          size="sm"
          variant="ghost"
          aria-label="Underline"
          onPressedChange={(pressed) => handleToggle("Underline", pressed)}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 20h16M8 12V4a4 4 0 118 0v8"
            />
          </svg>
        </Toggle>

        <div className="w-px h-6 bg-border mx-1" />

        <Toggle
          size="sm"
          variant="ghost"
          aria-label="Align left"
          onPressedChange={(pressed) => handleToggle("Align left", pressed)}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h12M4 14h16M4 18h12"
            />
          </svg>
        </Toggle>

        <Toggle
          size="sm"
          variant="ghost"
          aria-label="Align center"
          onPressedChange={(pressed) => handleToggle("Align center", pressed)}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M6 10h12M4 14h16M6 18h12"
            />
          </svg>
        </Toggle>

        <Toggle
          size="sm"
          variant="ghost"
          aria-label="Align right"
          onPressedChange={(pressed) => handleToggle("Align right", pressed)}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M8 10h12M4 14h16M8 18h12"
            />
          </svg>
        </Toggle>
      </div>
    </div>
  );
}

// Example 5: Single Toggle Group
export function SingleToggleGroupExample() {
  const { info } = useToast();
  const [alignment, setAlignment] = useState<string>("");

  const handleAlignmentChange = (value: string | string[]) => {
    const newAlignment = typeof value === "string" ? value : "";
    setAlignment(newAlignment);
    info("Alignment", `Text aligned to ${newAlignment || "default"}`);
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Text Alignment (Single)</h4>

      <div className="space-y-4">
        <Toggle.Group
          type="single"
          value={alignment}
          onValueChange={handleAlignmentChange}
          orientation="horizontal"
        >
          <Toggle.GroupItem value="left" aria-label="Align left">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h12M4 14h16M4 18h12"
              />
            </svg>
          </Toggle.GroupItem>

          <Toggle.GroupItem value="center" aria-label="Align center">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M6 10h12M4 14h16M6 18h12"
              />
            </svg>
          </Toggle.GroupItem>

          <Toggle.GroupItem value="right" aria-label="Align right">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M8 10h12M4 14h16M8 18h12"
              />
            </svg>
          </Toggle.GroupItem>

          <Toggle.GroupItem value="justify" aria-label="Justify text">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
          </Toggle.GroupItem>
        </Toggle.Group>

        <div className="text-xs text-on-muted">
          Current alignment: <span className="font-medium">{alignment || "none"}</span>
        </div>
      </div>
    </div>
  );
}

// Example 6: Multiple Toggle Group
export function MultipleToggleGroupExample() {
  const { info } = useToast();
  const [formats, setFormats] = useState<string[]>(["bold"]);

  const handleFormatsChange = (value: string | string[]) => {
    const newFormats = Array.isArray(value) ? value : [];
    setFormats(newFormats);
    info("Formatting", `Active formats: ${newFormats.join(", ") || "none"}`);
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Text Formatting (Multiple)</h4>

      <div className="space-y-4">
        <Toggle.Group
          type="multiple"
          value={formats}
          onValueChange={handleFormatsChange}
          orientation="horizontal"
        >
          <Toggle.GroupItem value="bold" aria-label="Bold">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h4m0 0V8a4 4 0 118 0v4m-8 0l4 4m0-4H8a4 4 0 01-4-4v0a4 4 0 014-4h4m0 0V4"
              />
            </svg>
            B
          </Toggle.GroupItem>

          <Toggle.GroupItem value="italic" aria-label="Italic">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            I
          </Toggle.GroupItem>

          <Toggle.GroupItem value="underline" aria-label="Underline">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 20h16M8 12V4a4 4 0 118 0v8"
              />
            </svg>
            U
          </Toggle.GroupItem>

          <Toggle.GroupItem value="strikethrough" aria-label="Strikethrough">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 12h16m-7 6V6"
              />
            </svg>
            S
          </Toggle.GroupItem>
        </Toggle.Group>

        <div className="text-xs text-on-muted">
          Active formats: <span className="font-medium">{formats.join(", ") || "none"}</span>
        </div>
      </div>
    </div>
  );
}

// Example 7: View Mode Toggle
export function ViewModeToggleExample() {
  const { info } = useToast();
  const [viewMode, setViewMode] = useState<string>("grid");

  const handleViewModeChange = (value: string | string[]) => {
    const newMode = typeof value === "string" ? value : "grid";
    setViewMode(newMode);
    info("View Mode", `Switched to ${newMode} view`);
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">View Mode Switcher</h4>

      <div className="space-y-4">
        <Toggle.Group
          type="single"
          value={viewMode}
          onValueChange={handleViewModeChange}
          orientation="horizontal"
        >
          <Toggle.GroupItem value="list" aria-label="List view">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            List
          </Toggle.GroupItem>

          <Toggle.GroupItem value="grid" aria-label="Grid view">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
              />
            </svg>
            Grid
          </Toggle.GroupItem>

          <Toggle.GroupItem value="card" aria-label="Card view">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Card
          </Toggle.GroupItem>
        </Toggle.Group>

        <div className="text-center p-4 border border-border rounded-lg">
          <div className="text-sm text-on-muted mb-2">Preview</div>
          <div className="text-lg font-medium">
            Current view: <span className="text-primary">{viewMode}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Example 8: Disabled States
export function DisabledToggleExample() {
  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Disabled States</h4>

      <div className="space-y-4">
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-on-muted">Individual Disabled</h5>
          <div className="flex items-center space-x-2">
            <Toggle aria-label="Available toggle">
              Available
            </Toggle>
            <Toggle disabled aria-label="Disabled toggle">
              Disabled
            </Toggle>
            <Toggle disabled defaultPressed aria-label="Disabled pressed toggle">
              Disabled Pressed
            </Toggle>
          </div>
        </div>

        <div className="space-y-2">
          <h5 className="text-xs font-medium text-on-muted">Group Disabled</h5>
          <Toggle.Group type="multiple" disabled orientation="horizontal">
            <Toggle.GroupItem value="option1" aria-label="Option 1">
              Option 1
            </Toggle.GroupItem>
            <Toggle.GroupItem value="option2" aria-label="Option 2">
              Option 2
            </Toggle.GroupItem>
            <Toggle.GroupItem value="option3" aria-label="Option 3">
              Option 3
            </Toggle.GroupItem>
          </Toggle.Group>
        </div>
      </div>
    </div>
  );
}

// Example 9: Custom Toggle States
export function CustomToggleExample() {
  const [favoriteCount, setFavoriteCount] = useState(42);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteToggle = (pressed: boolean) => {
    setIsFavorited(pressed);
    setFavoriteCount(prev => pressed ? prev + 1 : prev - 1);
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      <h4 className="text-sm font-medium text-fg">Interactive Example</h4>

      <div className="space-y-4">
        <div className="p-4 border border-border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <h6 className="font-medium">Awesome Article</h6>
            <Toggle
              pressed={isFavorited}
              onPressedChange={handleFavoriteToggle}
              variant="ghost"
              size="sm"
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <svg
                className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`}
                fill={isFavorited ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {favoriteCount}
            </Toggle>
          </div>

          <p className="text-sm text-on-muted">
            This is a great article about modern UI development.
          </p>

          <div className="text-xs text-on-muted">
            {isFavorited ? "Added to favorites!" : "Click the heart to favorite"}
          </div>
        </div>
      </div>
    </div>
  );
}