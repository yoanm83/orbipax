# OrbiPax UI Primitives

Modern React components built with TypeScript, Tailwind CSS v4, and 2025 best practices.

## Components

### Button
Modern button component with multiple variants and states.

```tsx
import { Button } from '@/shared/ui/primitives';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="outline" color="danger" size="lg">
  Delete
</Button>

// With loading state
<Button isLoading loadingText="Saving...">
  Save
</Button>

// With icons
<Button leftIcon={<Icon />} rightIcon={<ArrowIcon />}>
  Continue
</Button>
```

**Variants**: `solid` | `outline` | `ghost` | `link`
**Colors**: `primary` | `secondary` | `success` | `warning` | `danger` | `gray`
**Sizes**: `xs` | `sm` | `md` | `lg` | `xl`

### Input
Flexible input component with validation states and icons.

```tsx
import { Input } from '@/shared/ui/primitives';

// Basic usage
<Input label="Email" placeholder="Enter your email" />

// With validation
<Input
  label="Password"
  type="password"
  state="error"
  errorMessage="Password is required"
  isRequired
/>

// With icons and addons
<Input
  label="Website"
  leftAddon="https://"
  rightIcon={<LinkIcon />}
  placeholder="example.com"
/>

// Multiline
<Input
  label="Comments"
  multiline
  rows={4}
  helperText="Optional feedback"
/>
```

**Variants**: `outlined` | `filled` | `underlined`
**States**: `default` | `error` | `success` | `warning`
**Sizes**: `sm` | `md` | `lg`

### Card
Compound card component with header, body, and footer sections.

```tsx
import { Card } from '@/shared/ui/primitives';

// Basic usage
<Card>
  <Card.Header>
    <h3>Card Title</h3>
  </Card.Header>
  <Card.Body>
    <p>Card content goes here.</p>
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>

// Interactive card
<Card variant="elevated" interactive onClick={handleClick}>
  <Card.Body>
    Clickable card
  </Card.Body>
</Card>
```

**Variants**: `default` | `outlined` | `elevated` | `filled`
**Sizes**: `sm` | `md` | `lg`
**Padding**: `none` | `sm` | `md` | `lg`

### Form
Form component with field grouping and validation support.

```tsx
import { Form, Input, Button } from '@/shared/ui/primitives';

// Basic form
<Form layout="vertical" spacing="md">
  <Form.Field
    label="Full Name"
    required
    description="Enter your legal name"
  >
    <Input placeholder="John Doe" />
  </Form.Field>

  <Form.Group title="Contact Information">
    <Form.Field label="Email" error={errors.email}>
      <Input type="email" />
    </Form.Field>

    <Form.Field label="Phone">
      <Input type="tel" />
    </Form.Field>
  </Form.Group>

  <Form.Actions align="right">
    <Button variant="outline">Cancel</Button>
    <Button type="submit">Submit</Button>
  </Form.Actions>
</Form>
```

**Layouts**: `vertical` | `horizontal` | `inline`
**Spacing**: `sm` | `md` | `lg`

## Features

- **TypeScript**: Full type safety with proper interfaces
- **Tailwind CSS v4**: Modern utility classes with dark mode support
- **Accessibility**: WCAG 2.2 AA compliant with focus management
- **Responsive**: Mobile-first design with responsive variants
- **Modern Patterns**: forwardRef, compound components, discriminated unions
- **Customizable**: Extensive variant system with consistent API

## Design Principles

1. **Consistency**: Unified API patterns across all components
2. **Flexibility**: Extensive customization without complexity
3. **Performance**: Optimized for Tailwind CSS v4 and React 19
4. **Accessibility**: Keyboard navigation and screen reader support
5. **Developer Experience**: Excellent TypeScript integration and IntelliSense