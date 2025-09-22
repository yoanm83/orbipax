# React Hook Form + Zod Integration

Complete integration of React Hook Form with Zod validation for type-safe, performant forms using our design system primitives.

## Quick Start

```tsx
import { z } from "zod";
import { FormProvider, RHFFormField, RHFFormActions } from "@/shared/ui/primitives";
import { Input, Button } from "@/shared/ui/primitives";

// 1. Define your schema
const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

// 2. Create your form
function LoginForm() {
  const handleSubmit = async (data: FormData) => {
    console.log("Form data:", data);
  };

  return (
    <FormProvider
      schema={schema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={handleSubmit}
    >
      <RHFFormField<FormData>
        name="email"
        label="Email"
        required
      >
        {({ value, onChange, onBlur, error, invalid }) => (
          <Input
            type="email"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            state={invalid ? "error" : "default"}
            errorMessage={error}
            placeholder="Enter your email"
          />
        )}
      </RHFFormField>

      <RHFFormField<FormData>
        name="password"
        label="Password"
        required
      >
        {({ value, onChange, onBlur, error, invalid }) => (
          <Input
            type="password"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            state={invalid ? "error" : "default"}
            errorMessage={error}
            placeholder="Enter your password"
          />
        )}
      </RHFFormField>

      <RHFFormActions align="right">
        <Button type="submit" intent="primary">
          Sign In
        </Button>
      </RHFFormActions>
    </FormProvider>
  );
}
```

## Components

### FormProvider

Wrapper component that provides React Hook Form context with Zod validation.

```tsx
interface FormProviderProps<T extends FieldValues> {
  schema: ZodSchema<T>;              // Zod validation schema
  defaultValues?: Partial<T>;        // Initial form values
  onSubmit: (data: T) => void | Promise<void>;  // Submit handler
  children: React.ReactNode;
  layout?: "vertical" | "horizontal" | "inline";
  spacing?: "sm" | "md" | "lg";
}
```

**Features:**
- ✅ Automatic Zod validation with zodResolver
- ✅ TypeScript inference from schema
- ✅ Real-time validation (onChange mode)
- ✅ Loading states during submission
- ✅ Accessible form structure

### RHFFormField

Field component that connects inputs to React Hook Form.

```tsx
interface FormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;               // Field name (typed)
  label?: string;                   // Field label
  description?: string;             // Helper text
  required?: boolean;               // Required indicator
  children: (field: FieldRenderProps) => React.ReactNode;
}

interface FieldRenderProps {
  value: any;                       // Current field value
  onChange: (value: any) => void;   // Change handler
  onBlur: () => void;              // Blur handler
  error?: string;                  // Validation error
  invalid: boolean;                // Invalid state
}
```

**Usage Pattern:**
```tsx
<RHFFormField<FormData>
  name="fieldName"
  label="Field Label"
  required
  description="Optional helper text"
>
  {({ value, onChange, onBlur, error, invalid }) => (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      state={invalid ? "error" : "default"}
      errorMessage={error}
    />
  )}
</RHFFormField>
```

### RHFFormActions

Actions container for form buttons.

```tsx
<RHFFormActions align="right">
  <Button variant="outline" type="button">Cancel</Button>
  <Button type="submit" intent="primary">Submit</Button>
</RHFFormActions>
```

### RHFFormGroup

Fieldset container for grouping related fields.

```tsx
<RHFFormGroup title="Personal Information" description="Basic details">
  {/* Form fields */}
</RHFFormGroup>
```

## Advanced Examples

### Cross-Field Validation

```tsx
const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
```

### Conditional Fields

```tsx
const schema = z.object({
  accountType: z.enum(["personal", "business"]),
  companyName: z.string().optional(),
}).refine((data) => {
  if (data.accountType === "business") {
    return data.companyName && data.companyName.length > 0;
  }
  return true;
}, {
  message: "Company name is required for business accounts",
  path: ["companyName"],
});
```

### Array Fields

```tsx
const schema = z.object({
  emails: z.array(z.string().email()).min(1, "At least one email is required"),
});

// In your component
const [emails, setEmails] = useState<string[]>([""]);

<RHFFormField<FormData>
  name="emails"
  label="Email Addresses"
>
  {({ onChange, error, invalid }) => (
    <div className="space-y-2">
      {emails.map((email, index) => (
        <Input
          key={index}
          value={email}
          onChange={(e) => {
            const newEmails = [...emails];
            newEmails[index] = e.target.value;
            setEmails(newEmails);
            onChange(newEmails);
          }}
          state={invalid ? "error" : "default"}
          placeholder={`Email ${index + 1}`}
        />
      ))}
      {error && <p className="text-error text-xs">{error}</p>}
    </div>
  )}
</RHFFormField>
```

### File Upload

```tsx
const schema = z.object({
  avatar: z.instanceof(File).optional(),
});

<RHFFormField<FormData>
  name="avatar"
  label="Profile Picture"
>
  {({ onChange, error, invalid }) => (
    <Input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        onChange(file);
      }}
      state={invalid ? "error" : "default"}
      errorMessage={error}
    />
  )}
</RHFFormField>
```

## Validation Patterns

### Common Validations

```tsx
// Email
z.string().email("Please enter a valid email address")

// Password
z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number")

// Phone
z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number")

// URL
z.string().url("Please enter a valid URL")

// Date
z.string().datetime("Please enter a valid date")

// Number range
z.number().min(18, "Must be at least 18").max(120, "Must be less than 120")

// Optional with default
z.string().optional().default("")

// Enum
z.enum(["small", "medium", "large"], { message: "Please select a valid size" })
```

### Custom Validations

```tsx
const schema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .refine(async (username) => {
      // Simulate API call to check availability
      const available = await checkUsernameAvailability(username);
      return available;
    }, "Username is already taken"),
});
```

## Performance Tips

### 1. Use React.memo for Field Components

```tsx
const MemoizedInput = React.memo(({ value, onChange, onBlur, error, invalid, ...props }) => (
  <Input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
    state={invalid ? "error" : "default"}
    errorMessage={error}
    {...props}
  />
));
```

### 2. Debounce Expensive Validations

```tsx
const debouncedValidation = useMemo(
  () => debounce(async (value: string) => {
    // Expensive validation logic
  }, 300),
  []
);
```

### 3. Optimize Re-renders

```tsx
// Use useCallback for handlers
const handleSubmit = useCallback(async (data: FormData) => {
  // Submit logic
}, []);

// Use React Hook Form's watch selectively
const watchedField = watch("specificField"); // Instead of watching all fields
```

## Accessibility Features

### Built-in ARIA Support

- ✅ `aria-invalid` on fields with errors
- ✅ `aria-describedby` linking to error messages
- ✅ `aria-live="polite"` for error announcements
- ✅ `aria-required` for required fields
- ✅ Proper label associations with `htmlFor`

### Keyboard Navigation

- ✅ Tab order follows visual order
- ✅ Enter key submits forms
- ✅ Escape key cancels (when implemented)
- ✅ Focus management on errors

## Testing

### Unit Testing Forms

```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("validates required email field", async () => {
  const onSubmit = jest.fn();

  render(
    <FormProvider schema={schema} onSubmit={onSubmit} defaultValues={{}}>
      {/* Form content */}
    </FormProvider>
  );

  const submitButton = screen.getByRole("button", { name: /submit/i });

  await userEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  expect(onSubmit).not.toHaveBeenCalled();
});
```

### Integration Testing

```tsx
test("submits form with valid data", async () => {
  const onSubmit = jest.fn();

  render(<MyForm onSubmit={onSubmit} />);

  await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
  await userEvent.type(screen.getByLabelText(/password/i), "password123");
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });
});
```

## Migration from Basic Forms

### Before (Basic Form Component)

```tsx
<Form layout="vertical">
  <Form.Field label="Email" error={errors.email}>
    <Input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      state={errors.email ? "error" : "default"}
    />
  </Form.Field>
</Form>
```

### After (React Hook Form + Zod)

```tsx
<FormProvider schema={schema} onSubmit={handleSubmit} defaultValues={{}}>
  <RHFFormField name="email" label="Email">
    {({ value, onChange, onBlur, error, invalid }) => (
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        state={invalid ? "error" : "default"}
        errorMessage={error}
      />
    )}
  </RHFFormField>
</FormProvider>
```

## Benefits

✅ **Type Safety**: Full TypeScript inference from Zod schemas
✅ **Performance**: Minimal re-renders with React Hook Form
✅ **Validation**: Client and server-side validation with Zod
✅ **Accessibility**: Built-in ARIA support and keyboard navigation
✅ **Developer Experience**: Excellent IntelliSense and error catching
✅ **Consistency**: Uses our design system tokens throughout
✅ **Flexibility**: Supports any input component or custom controls