import { forwardRef, useState, useCallback, useId, useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode, ChangeEvent, KeyboardEvent } from "react";

// Textarea variant configurations based on modern 2025 patterns
interface TextareaVariants {
  size: "sm" | "md" | "lg";
  variant: "outlined" | "filled" | "underlined" | "ghost";
  state: "default" | "error" | "success" | "warning";
  resize: "none" | "vertical" | "horizontal" | "both" | "auto";
}

// Textarea props interface
interface TextareaProps extends Omit<ComponentPropsWithoutRef<"textarea">, "size"> {
  size?: TextareaVariants["size"];
  variant?: TextareaVariants["variant"];
  state?: TextareaVariants["state"];
  resize?: TextareaVariants["resize"];
  label?: ReactNode;
  description?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  characterCount?: boolean;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
  autoResize?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onValueChange?: (value: string) => void;
  onCharacterCountChange?: (count: number, maxLength?: number) => void;
}

// Character counter props
interface CharacterCounterProps {
  current: number;
  max?: number;
  variant?: "default" | "warning" | "error";
}

// Semantic class configurations using design tokens
const textareaVariants = {
  container: {
    base: "relative w-full"
  },

  wrapper: {
    base: "relative w-full",
    disabled: "opacity-50 cursor-not-allowed"
  },

  textarea: {
    base: "w-full px-3 py-2 text-sm transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground",

    sizes: {
      sm: "px-2 py-1.5 text-xs rounded-md min-h-[60px]",
      md: "px-3 py-2 text-sm rounded-md min-h-[80px]",
      lg: "px-4 py-3 text-base rounded-lg min-h-[100px]"
    },

    variants: {
      outlined: {
        default: "border border-input bg-transparent hover:border-border-hover focus:border-ring focus:ring-ring/20",
        error: "border-error bg-transparent hover:border-error focus:border-error focus:ring-error/20",
        success: "border-success bg-transparent hover:border-success focus:border-success focus:ring-success/20",
        warning: "border-warning bg-transparent hover:border-warning focus:border-warning focus:ring-warning/20"
      },
      filled: {
        default: "border-0 bg-muted hover:bg-muted-hover focus:bg-bg focus:ring-ring/20",
        error: "border-0 bg-error/10 hover:bg-error/20 focus:bg-bg focus:ring-error/20",
        success: "border-0 bg-success/10 hover:bg-success/20 focus:bg-bg focus:ring-success/20",
        warning: "border-0 bg-warning/10 hover:bg-warning/20 focus:bg-bg focus:ring-warning/20"
      },
      underlined: {
        default: "border-0 border-b-2 border-input bg-transparent rounded-none hover:border-border-hover focus:border-ring focus:ring-0 focus:ring-offset-0",
        error: "border-0 border-b-2 border-error bg-transparent rounded-none hover:border-error focus:border-error focus:ring-0",
        success: "border-0 border-b-2 border-success bg-transparent rounded-none hover:border-success focus:border-success focus:ring-0",
        warning: "border-0 border-b-2 border-warning bg-transparent rounded-none hover:border-warning focus:border-warning focus:ring-0"
      },
      ghost: {
        default: "border-0 bg-transparent hover:bg-muted focus:bg-muted focus:ring-ring/20",
        error: "border-0 bg-transparent hover:bg-error/10 focus:bg-error/10 focus:ring-error/20",
        success: "border-0 bg-transparent hover:bg-success/10 focus:bg-success/10 focus:ring-success/20",
        warning: "border-0 bg-transparent hover:bg-warning/10 focus:bg-warning/10 focus:ring-warning/20"
      }
    },

    resize: {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
      auto: "resize-none overflow-hidden"
    },

    disabled: "cursor-not-allowed opacity-50",
    readOnly: "cursor-default"
  },

  label: {
    base: "block text-sm font-medium mb-2",
    states: {
      default: "text-fg",
      error: "text-error",
      success: "text-success",
      warning: "text-warning"
    },
    disabled: "opacity-50 cursor-not-allowed",
    required: "after:content-['*'] after:text-error after:ml-1"
  },

  description: "mt-1 text-xs text-on-muted",

  message: {
    error: "mt-1 text-xs text-error",
    success: "mt-1 text-xs text-success",
    warning: "mt-1 text-xs text-warning"
  },

  characterCounter: {
    base: "mt-1 text-xs flex justify-end",
    states: {
      default: "text-on-muted",
      warning: "text-warning",
      error: "text-error"
    }
  }
};

// Character Counter component
const CharacterCounter = forwardRef<HTMLDivElement, CharacterCounterProps>(
  ({ current, max, variant = "default" }, ref) => {
    const getVariant = () => {
      if (!max) { return "default"; }
      if (current >= max) { return "error"; }
      if (current >= max * 0.9) { return "warning"; }
      return "default";
    };

    const finalVariant = variant !== "default" ? variant : getVariant();

    return (
      <div
        ref={ref}
        className={`${textareaVariants.characterCounter.base} ${textareaVariants.characterCounter.states[finalVariant]}`}
        aria-live="polite"
      >
        {max ? `${current}/${max}` : current}
      </div>
    );
  }
);

CharacterCounter.displayName = "CharacterCounter";

// Main Textarea component
const TextareaRoot = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = "md",
      variant = "outlined",
      state = "default",
      resize = "vertical",
      label,
      description,
      errorMessage,
      successMessage,
      warningMessage,
      characterCount = false,
      maxLength,
      minRows = 3,
      maxRows,
      autoResize = false,
      required = false,
      disabled = false,
      readOnly = false,
      value: controlledValue,
      defaultValue,
      onChange,
      onValueChange,
      onCharacterCountChange,
      className = "",
      id: providedId,
      style,
      ...props
    },
    ref
  ) => {
    // State management
    const [internalValue, setInternalValue] = useState(defaultValue || "");
    const [textareaHeight, setTextareaHeight] = useState<number | undefined>(undefined);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;
    const stringValue = typeof value === "string" ? value : "";

    // Refs
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const hiddenTextareaRef = useRef<HTMLTextAreaElement>(null);

    // Generate unique ID for accessibility
    const generatedId = useId();
    const id = providedId || generatedId;

    // Auto-resize functionality
    const calculateHeight = useCallback(() => {
      if (!autoResize || !textareaRef.current) { return; }

      const textarea = textareaRef.current;

      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto";

      let newHeight = textarea.scrollHeight;

      // Apply min/max rows constraints
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10) || 20;

      if (minRows) {
        const minHeight = lineHeight * minRows + 16; // Add padding
        newHeight = Math.max(newHeight, minHeight);
      }

      if (maxRows) {
        const maxHeight = lineHeight * maxRows + 16; // Add padding
        newHeight = Math.min(newHeight, maxHeight);
      }

      textarea.style.height = `${newHeight}px`;
      setTextareaHeight(newHeight);
    }, [autoResize, minRows, maxRows]);

    // Handle value changes
    const handleChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;

      // Check max length
      if (maxLength && newValue.length > maxLength) {
        return;
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }

      onChange?.(event);
      onValueChange?.(newValue);
      onCharacterCountChange?.(newValue.length, maxLength);

      // Trigger auto-resize after state update
      if (autoResize) {
        setTimeout(() => calculateHeight(), 0);
      }
    }, [isControlled, onChange, onValueChange, onCharacterCountChange, maxLength, autoResize, calculateHeight]);

    // Handle keyboard events
    const handleKeyDown = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
      // Allow tab to work normally in textarea
      if (event.key === "Tab") {
        return;
      }

      props.onKeyDown?.(event);
    }, [props]);

    // Calculate initial height and on value changes
    useEffect(() => {
      if (autoResize) {
        calculateHeight();
      }
    }, [calculateHeight, stringValue]);

    // Determine final state (error message takes precedence)
    const finalState = errorMessage ? "error"
                     : successMessage ? "success"
                     : warningMessage ? "warning"
                     : state;

    // Build textarea classes
    const textareaClasses = [
      textareaVariants.textarea.base,
      textareaVariants.textarea.sizes[size],
      textareaVariants.textarea.variants[variant][finalState],
      autoResize ? textareaVariants.textarea.resize.auto : textareaVariants.textarea.resize[resize],
      disabled && textareaVariants.textarea.disabled,
      readOnly && textareaVariants.textarea.readOnly,
      className
    ].filter(Boolean).join(" ");

    // Build label classes
    const labelClasses = [
      textareaVariants.label.base,
      textareaVariants.label.states[finalState],
      disabled && textareaVariants.label.disabled,
      required && textareaVariants.label.required
    ].filter(Boolean).join(" ");

    // Calculate character count variant
    const characterCountVariant = (() => {
      if (!maxLength) { return "default"; }
      if (stringValue.length >= maxLength) { return "error"; }
      if (stringValue.length >= maxLength * 0.9) { return "warning"; }
      return "default";
    })();

    // Create style object with auto-resize height
    const textareaStyle = {
      ...style,
      ...(autoResize && textareaHeight && { height: textareaHeight })
    };

    return (
      <div className={textareaVariants.container.base}>
        {/* Label */}
        {label && (
          <label htmlFor={id} className={labelClasses}>
            {label}
          </label>
        )}

        {/* Textarea Wrapper */}
        <div className={`${textareaVariants.wrapper.base} ${disabled ? textareaVariants.wrapper.disabled : ""}`}>
          <textarea
            ref={(node) => {
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              textareaRef.current = node;
            }}
            id={id}
            value={stringValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            maxLength={maxLength}
            rows={autoResize ? undefined : minRows}
            aria-invalid={finalState === "error"}
            aria-describedby={
              [
                description && `${id}-description`,
                errorMessage && `${id}-error`,
                successMessage && `${id}-success`,
                warningMessage && `${id}-warning`,
                characterCount && `${id}-count`
              ].filter(Boolean).join(" ") || undefined
            }
            className={textareaClasses}
            style={textareaStyle}
            {...props}
          />
        </div>

        {/* Description */}
        {description && !errorMessage && !successMessage && !warningMessage && (
          <p id={`${id}-description`} className={textareaVariants.description}>
            {description}
          </p>
        )}

        {/* Error Message */}
        {errorMessage && (
          <p id={`${id}-error`} className={textareaVariants.message.error} aria-live="polite">
            {errorMessage}
          </p>
        )}

        {/* Success Message */}
        {successMessage && !errorMessage && (
          <p id={`${id}-success`} className={textareaVariants.message.success} aria-live="polite">
            {successMessage}
          </p>
        )}

        {/* Warning Message */}
        {warningMessage && !errorMessage && !successMessage && (
          <p id={`${id}-warning`} className={textareaVariants.message.warning} aria-live="polite">
            {warningMessage}
          </p>
        )}

        {/* Character Counter */}
        {characterCount && (
          <CharacterCounter
            current={stringValue.length}
            max={maxLength}
            variant={characterCountVariant}
          />
        )}
      </div>
    );
  }
);

TextareaRoot.displayName = "Textarea";

// Compound component interface
interface TextareaComponent extends React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>> {
  CharacterCounter: typeof CharacterCounter;
}

// Compound component pattern - attach sub-components to main Textarea
const TextareaWithSubComponents = TextareaRoot as TextareaComponent;
TextareaWithSubComponents.CharacterCounter = CharacterCounter;

export { TextareaWithSubComponents as Textarea };

// Export types for external use
export type {
  TextareaProps,
  TextareaVariants,
  CharacterCounterProps
};