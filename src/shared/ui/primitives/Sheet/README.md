# Sheet Component

A modal sheet/drawer component built on top of Radix UI Dialog primitives. Supports sliding in from different sides with smooth animations and accessibility features.

## Components

### Base Components

- `Sheet` - Root component that provides context
- `SheetTrigger` - Button/element that triggers the sheet
- `SheetContent` - Main container for sheet content
- `SheetTitle` - Title component for the sheet
- `SheetDescription` - Description text for the sheet
- `SheetClose` - Close button component

### Custom Components

- `SheetHeader` - Enhanced header with icon support and close button
- `SheetFooter` - Footer with action buttons and loading states
- `SheetSkeleton` - Loading skeleton for sheet content

## Basic Usage

```tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui'

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>
          Make changes to your profile here. Click save when you're done.
        </SheetDescription>
        {/* Your form content here */}
      </SheetContent>
    </Sheet>
  )
}
```

## With Custom Header and Footer

```tsx
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetFooter,
  SheetBody,
} from '@/shared/ui'
import { Settings } from 'lucide-react'

export function SheetWithCustomComponents() {
  const [open, setOpen] = useState(false)
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Open Settings</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader
          title="Settings"
          subtitle="Manage your account settings"
          icon={<Settings className="h-5 w-5" />}
          onClose={() => setOpen(false)}
        />
        
        <SheetBody>
          {/* Your content here */}
        </SheetBody>
        
        <SheetFooter
          onCancel={() => setOpen(false)}
          onConfirm={() => {
            // Handle save
            setOpen(false)
          }}
          confirmLabel="Save Changes"
        />
      </SheetContent>
    </Sheet>
  )
}
```

## Sheet Positions

The sheet can slide in from different sides:

```tsx
<SheetContent side="left">...</SheetContent>   // Slides from left
<SheetContent side="right">...</SheetContent>  // Slides from right (default)
<SheetContent side="top">...</SheetContent>    // Slides from top
<SheetContent side="bottom">...</SheetContent> // Slides from bottom
```

## Loading State

Use `SheetSkeleton` to show a loading state:

```tsx
<SheetContent>
  {isLoading ? (
    <SheetSkeleton sections={3} />
  ) : (
    // Your actual content
  )}
</SheetContent>
```

## Props

### SheetContent
- `side?: "top" | "right" | "bottom" | "left"` - Position of the sheet (default: "right")
- `hideCloseButton?: boolean` - Hide the default close button
- `className?: string` - Additional CSS classes

### SheetHeader (Custom)
- `title: string` - Header title (required)
- `subtitle?: string` - Optional subtitle
- `icon?: ReactNode` - Optional icon element
- `onClose?: () => void` - Close handler
- `showCloseButton?: boolean` - Show/hide close button

### SheetFooter (Custom)
- `onCancel?: () => void` - Cancel button handler
- `onConfirm?: () => void` - Confirm button handler
- `cancelLabel?: string` - Cancel button text (default: "Cancel")
- `confirmLabel?: string` - Confirm button text (default: "Save")
- `isLoading?: boolean` - Show loading state
- `isDisabled?: boolean` - Disable buttons
- `showCancel?: boolean` - Show/hide cancel button

### SheetSkeleton
- `sections?: number` - Number of skeleton sections (default: 3)
- `showHeader?: boolean` - Show header skeleton
- `showFooter?: boolean` - Show footer skeleton

## Accessibility

- Full keyboard navigation support
- ARIA attributes for screen readers
- Focus management
- Escape key to close
- Click outside to close

## Notes

- The component uses Radix UI Dialog under the hood
- Animations are handled with Tailwind CSS classes
- Supports both controlled and uncontrolled usage
- Automatically locks body scroll when open