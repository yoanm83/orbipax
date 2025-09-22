"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { useForm, FormProvider as RHFFormProvider, useFormContext, type FieldPath, type FieldValues } from "react-hook-form";
import type { ZodSchema } from "zod";

// Form Provider props with Zod integration
interface FormProviderProps<T extends FieldValues> extends Omit<ComponentPropsWithoutRef<"form">, "onSubmit"> {
  schema: ZodSchema<T>;
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: React.ReactNode;
  layout?: "vertical" | "horizontal" | "inline";
  spacing?: "sm" | "md" | "lg";
}

// Export useFormContext from react-hook-form
// Note: This is re-exported from react-hook-form

// FormProvider component that wraps React Hook Form
export function FormProvider<T extends FieldValues = FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  layout = "vertical",
  spacing = "md",
  className = "",
  ...props
}: FormProviderProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as Partial<T>,
    mode: "onChange", // Validate on change for better UX
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  // Form classes using our design tokens
  const formClasses = [
    "w-full",
    layout === "vertical" && "space-y-4",
    layout === "horizontal" && "space-y-4",
    layout === "inline" && "flex flex-wrap gap-4 items-end",
    spacing === "sm" && layout !== "inline" && "space-y-2",
    spacing === "md" && layout !== "inline" && "space-y-4",
    spacing === "lg" && layout !== "inline" && "space-y-6",
    isSubmitting && "opacity-60 pointer-events-none",
    className
  ].filter(Boolean).join(" ");

  return (
    <RHFFormProvider {...methods}>
      <form
        className={formClasses}
        onSubmit={handleSubmit(onSubmit)}
        noValidate // We handle validation with Zod
        {...props}
      >
        {children}
      </form>
    </RHFFormProvider>
  );
}

// Form field component that integrates with React Hook Form
interface FormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  description?: string;
  required?: boolean;
  children: (field: {
    value: T[FieldPath<T>];
    onChange: (value: T[FieldPath<T>]) => void;
    onBlur: () => void;
    error?: string;
    invalid: boolean;
  }) => React.ReactNode;
}

export function FormField<T extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required = false,
  children,
}: FormFieldProps<T>) {
  const {
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useFormContext<T>();

  const value = watch(name);
  const error = errors[name]?.message as string | undefined;
  const invalid = !!errors[name];

  // Field wrapper classes
  const fieldClasses = "w-full flex flex-col";

  // Label classes with semantic tokens
  const labelClasses = [
    "block text-sm font-medium mb-1.5",
    error ? "text-error" : "text-fg"
  ].join(" ");

  // Description and error classes
  const descriptionClasses = "mt-1 text-xs text-on-muted";
  const errorClasses = "mt-1 text-xs text-error";

  const handleChange = (newValue: T[FieldPath<T>]) => {
    setValue(name, newValue);
    trigger(name); // Trigger validation
  };

  const handleBlur = () => {
    trigger(name); // Trigger validation on blur
  };

  return (
    <div className={fieldClasses}>
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {children({
        value,
        onChange: handleChange,
        onBlur: handleBlur,
        error,
        invalid,
      })}

      {description && !error && (
        <p className={descriptionClasses}>
          {description}
        </p>
      )}

      {error && (
        <p className={errorClasses} aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}

// Form Actions component for submit/cancel buttons
interface FormActionsProps extends ComponentPropsWithoutRef<"div"> {
  align?: "left" | "center" | "right" | "between";
  children: React.ReactNode;
}

export const FormActions = forwardRef<HTMLDivElement, FormActionsProps>(
  ({ align = "right", className = "", children, ...props }, ref) => {
    const actionsClasses = [
      "flex gap-3 pt-4",
      align === "left" && "justify-start",
      align === "center" && "justify-center",
      align === "right" && "justify-end",
      align === "between" && "justify-between",
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

// Form Group component for grouping related fields
interface FormGroupProps extends ComponentPropsWithoutRef<"fieldset"> {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const FormGroup = forwardRef<HTMLFieldSetElement, FormGroupProps>(
  ({ title, description, className = "", children, ...props }, ref) => {
    const groupClasses = [
      "border border-border rounded-md p-4 space-y-4",
      className
    ].filter(Boolean).join(" ");

    return (
      <fieldset ref={ref} className={groupClasses} {...props}>
        {title && (
          <legend className="text-base font-semibold text-fg mb-2">
            {title}
          </legend>
        )}

        {description && (
          <p className="text-sm text-on-muted mb-4">
            {description}
          </p>
        )}

        {children}
      </fieldset>
    );
  }
);

FormGroup.displayName = "FormGroup";

// Export types for external use
export type { FormProviderProps, FormFieldProps, FormActionsProps, FormGroupProps };