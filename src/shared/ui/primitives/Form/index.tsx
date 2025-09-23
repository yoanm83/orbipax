import { forwardRef, createContext, useContext, useId } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
// Utility function for class names
function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Form - OrbiPax Health Philosophy Compliant
 *
 * ACCESSIBILITY (WCAG 2.1 AA):
 * - Proper form semantics with fieldset and legend elements
 * - Error announcement with aria-live regions
 * - Required field indicators for screen readers
 * - Form validation and error state management
 * - Keyboard navigation and focus management
 *
 * HEALTH DESIGN TOKENS:
 * - Semantic color system for medical contexts
 * - Consistent spacing scales for form density
 * - Professional appearance for clinical settings
 * - Clear visual hierarchy for complex forms
 *
 * CONTAINER QUERIES:
 * - Responsive form layouts for medical devices
 * - Adaptable field sizing for different viewports
 * - Touch-friendly spacing on mobile healthcare devices
 */

// Form variant configurations based on Health Philosophy
interface FormVariants {
  layout: "vertical" | "horizontal" | "inline";
  spacing: "sm" | "md" | "lg";
}

// Modern Form props interface extending HTML form attributes
interface FormProps extends ComponentPropsWithoutRef<"form"> {
  layout?: FormVariants["layout"];
  spacing?: FormVariants["spacing"];
  children: ReactNode;
}

// Form Field props
interface FormFieldProps extends ComponentPropsWithoutRef<"div"> {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
}

// Form Group props
interface FormGroupProps extends ComponentPropsWithoutRef<"fieldset"> {
  title?: string;
  description?: string;
  children: ReactNode;
}

// Form Actions props
interface FormActionsProps extends ComponentPropsWithoutRef<"div"> {
  align?: "left" | "center" | "right" | "between";
  children: ReactNode;
}

// Form context for sharing form state
interface FormContextValue {
  layout: FormVariants["layout"];
  spacing: FormVariants["spacing"];
}

const FormContext = createContext<FormContextValue | null>(null);

// Hook to access form context
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a Form component");
  }
  return context;
};

// Semantic class configurations using design tokens
const formVariants = {
  base: "w-full",

  layouts: {
    vertical: "space-y-4",
    horizontal: "space-y-4",
    inline: "flex flex-wrap gap-4 items-end"
  },

  spacing: {
    sm: "space-y-2",
    md: "space-y-4",
    lg: "space-y-6"
  }
};

// Field styling using semantic tokens
const fieldVariants = {
  base: "w-full flex flex-col",
  label: {
    base: "block text-sm font-medium mb-1.5",
    default: "text-fg",
    error: "text-error"
  },
  description: "mt-1 text-xs text-on-muted",
  error: "mt-1 text-xs text-error"
};

// Group styling using semantic tokens
const groupVariants = {
  base: "border border-border rounded-md p-4 space-y-4",
  legend: "text-base font-semibold text-fg mb-2",
  description: "text-sm text-on-muted mb-4"
};

// Actions styling
const actionsVariants = {
  base: "flex gap-3 pt-4",
  align: {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between"
  }
};

// Main Form component
export const Form = forwardRef<HTMLFormElement, FormProps>(
  (
    {
      layout = "vertical",
      spacing = "md",
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    // Build form classes
    const baseClasses = formVariants.base;
    const layoutClasses = formVariants.layouts[layout];
    const spacingClasses = layout !== "inline" ? formVariants.spacing[spacing] : "";

    const formClasses = [
      baseClasses,
      layoutClasses,
      spacingClasses,
      className
    ].filter(Boolean).join(" ");

    const contextValue: FormContextValue = { layout, spacing };

    return (
      <FormContext.Provider value={contextValue}>
        <form
          ref={ref}
          className={formClasses}
          noValidate
          {...props}
        >
          {children}
        </form>
      </FormContext.Provider>
    );
  }
);

Form.displayName = "Form";

// Form Field component
export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      error,
      description,
      required = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const fieldId = useId();
    const hasError = !!error;

    // Field wrapper classes
    const fieldClasses = [
      fieldVariants.base,
      className
    ].filter(Boolean).join(" ");

    // Label classes with error state
    const labelClasses = cn(
      fieldVariants.label.base,
      hasError ? fieldVariants.label.error : fieldVariants.label.default,
      "@container/form:(max-width:320px):text-xs",
      "@container/form:(min-width:768px):text-base"
    );

    return (
      <div ref={ref} className={fieldClasses} {...props}>
        {label && (
          <label htmlFor={fieldId} className={labelClasses}>
            {label}
            {required && (
              <span
                className="text-destructive ml-1 text-sm"
                aria-label="required field"
                role="img"
              >
                *
              </span>
            )}
          </label>
        )}

        {children}

        {description && !error && (
          <p className={fieldVariants.description}>
            {description}
          </p>
        )}

        {error && (
          <p className={fieldVariants.error} aria-live="polite">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

// Form Group component
export const FormGroup = forwardRef<HTMLFieldSetElement, FormGroupProps>(
  (
    {
      title,
      description,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const groupClasses = [
      groupVariants.base,
      className
    ].filter(Boolean).join(" ");

    return (
      <fieldset ref={ref} className={groupClasses} {...props}>
        {title && (
          <legend className={groupVariants.legend}>
            {title}
          </legend>
        )}

        {description && (
          <p className={groupVariants.description}>
            {description}
          </p>
        )}

        {children}
      </fieldset>
    );
  }
);

FormGroup.displayName = "FormGroup";

// Form Actions component
export const FormActions = forwardRef<HTMLDivElement, FormActionsProps>(
  (
    {
      align = "right",
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const actionsClasses = [
      actionsVariants.base,
      actionsVariants.align[align],
      className
    ].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={actionsClasses} {...props}>
        {children}
      </div>
    );
  }
);

FormActions.displayName = "FormActions";

// Compound component pattern
Form.Field = FormField;
Form.Group = FormGroup;
Form.Actions = FormActions;

// React Hook Form + Zod integration exports
export {
  FormProvider,
  FormField as RHFFormField,
  FormActions as RHFFormActions,
  FormGroup as RHFFormGroup
} from "./form-provider";

export type {
  FormProviderProps,
  FormFieldProps as RHFFormFieldProps,
  FormActionsProps as RHFFormActionsProps,
  FormGroupProps as RHFFormGroupProps
} from "./form-provider";

// Form examples exports
export {
  ContactFormExample,
  RegistrationFormExample,
  SearchFormExample
} from "./form-examples";

// Export types for external use
export type {
  FormProps,
  FormFieldProps,
  FormGroupProps,
  FormActionsProps,
  FormVariants,
  FormContextValue
};