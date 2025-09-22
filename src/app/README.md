# Next.js App Routes

UI-only layer containing Next.js app router pages and React Server Components.
No business logic or direct infrastructure access - delegates to module application layers.
Handles routing, RSC boundaries, and user interface orchestration.

## UI Token Usage

UI components in this layer consume design tokens via Tailwind classes and CSS variables.
All styling uses the centralized token system defined in `src/styles/globals.css`.

### Token Consumption Patterns

```tsx
// Use Tailwind classes that reference CSS variables
export default function Page() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="border-b border-border">
        <h1 className="text-step-2 font-semibold">Page Title</h1>
      </header>
      <main className="container-safe py-8">
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
          Primary Action
        </button>
      </main>
    </div>
  )
}
```

### Dark Mode Support

Components automatically support dark mode through CSS variable overrides:

```tsx
// No additional code needed - tokens automatically switch
<div className="bg-muted text-muted-foreground">
  Content adapts to light/dark theme automatically
</div>
```

### Accessibility Guidelines

- Use semantic color tokens (primary, destructive, etc.) rather than arbitrary colors
- Ensure focus states are visible using `focus:outline-focus` or similar
- Use the fluid typography scale (`text-step-*`) for responsive text sizing
- Apply `.sr-only` class for screen reader content

### RSC Boundaries

React Server Components in this layer should:
- Import and use design tokens through Tailwind classes
- Avoid client-side styling logic
- Delegate theme switching to client components when needed

**No business logic - purely presentational layer using the design token system.**