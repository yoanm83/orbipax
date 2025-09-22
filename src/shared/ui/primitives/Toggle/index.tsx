import { forwardRef, createContext, useContext, useState, useCallback, useId } from "react";
import type { ComponentPropsWithoutRef, ReactNode, KeyboardEvent } from "react";

// Toggle variant configurations based on modern 2025 patterns
interface ToggleVariants {
  size: "sm" | "md" | "lg";
  variant: "default" | "outline" | "ghost" | "soft";
  state: "default" | "pressed";
}

// Toggle props interface
interface ToggleProps extends Omit<ComponentPropsWithoutRef<"button">, "type"> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  size?: ToggleVariants["size"];
  variant?: ToggleVariants["variant"];
  disabled?: boolean;
  "aria-label"?: string;
  children: ReactNode;
}

// Toggle group props
interface ToggleGroupProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  loop?: boolean;
  rovingFocus?: boolean;
  children: ReactNode;
}

// Toggle group item props
interface ToggleGroupItemProps extends Omit<ToggleProps, "pressed" | "defaultPressed" | "onPressedChange"> {
  value: string;
}

// Toggle group context value
interface ToggleGroupContextValue {
  type: "single" | "multiple";
  value: string | string[];
  onValueChange: (itemValue: string) => void;
  disabled: boolean;
  size: ToggleVariants["size"];
  variant: ToggleVariants["variant"];
  orientation: "horizontal" | "vertical";
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  itemCount: number;
  setItemCount: (count: number) => void;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

// Hook to access toggle group context
export const useToggleGroupContext = () => {
  const context = useContext(ToggleGroupContext);
  return context; // Can be null for standalone toggles
};

// Semantic class configurations using design tokens
const toggleVariants = {
  root: {
    base: "inline-flex items-center justify-center rounded-md font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",

    sizes: {
      sm: "h-8 px-2 text-xs gap-1",
      md: "h-9 px-3 text-sm gap-2",
      lg: "h-10 px-4 text-base gap-2"
    },

    variants: {
      default: {
        default: "bg-transparent border border-input hover:bg-accent hover:text-accent-foreground",
        pressed: "bg-accent text-accent-foreground border-accent"
      },
      outline: {
        default: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        pressed: "bg-accent text-accent-foreground border-accent"
      },
      ghost: {
        default: "bg-transparent hover:bg-accent hover:text-accent-foreground",
        pressed: "bg-accent text-accent-foreground"
      },
      soft: {
        default: "bg-muted text-muted-foreground hover:bg-muted/80",
        pressed: "bg-primary text-primary-foreground"
      }
    },

    disabled: "opacity-50 cursor-not-allowed pointer-events-none"
  },

  group: {
    base: "flex",

    orientations: {
      horizontal: "flex-row",
      vertical: "flex-col"
    },

    spacing: {
      horizontal: "gap-1",
      vertical: "gap-1"
    }
  }
};

// Main Toggle component
const ToggleRoot = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      pressed: controlledPressed,
      defaultPressed = false,
      onPressedChange,
      size = "md",
      variant = "default",
      disabled = false,
      className = "",
      children,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    // State management for controlled/uncontrolled
    const [internalPressed, setInternalPressed] = useState(defaultPressed);
    const isControlled = controlledPressed !== undefined;
    const pressed = isControlled ? controlledPressed : internalPressed;

    // Generate unique ID for accessibility
    const toggleId = useId();

    // Check if we're in a group context
    const groupContext = useToggleGroupContext();

    // Handle press state changes
    const handlePressedChange = useCallback((newPressed: boolean) => {
      if (!isControlled) {
        setInternalPressed(newPressed);
      }
      onPressedChange?.(newPressed);
    }, [isControlled, onPressedChange]);

    // Handle click events
    const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) { return; }

      if (groupContext && props.value) {
        groupContext.onValueChange(props.value);
      } else {
        handlePressedChange(!pressed);
      }

      onClick?.(event);
    }, [disabled, groupContext, props.value, handlePressedChange, pressed, onClick]);

    // Handle keyboard events
    const handleKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) { return; }

      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault();
          if (groupContext && props.value) {
            groupContext.onValueChange(props.value);
          } else {
            handlePressedChange(!pressed);
          }
          break;
        case "ArrowRight":
        case "ArrowDown":
          if (groupContext && groupContext.orientation === "horizontal") {
            event.preventDefault();
            // Navigate to next toggle in group
          }
          break;
        case "ArrowLeft":
        case "ArrowUp":
          if (groupContext && groupContext.orientation === "horizontal") {
            event.preventDefault();
            // Navigate to previous toggle in group
          }
          break;
      }

      onKeyDown?.(event);
    }, [disabled, groupContext, props.value, handlePressedChange, pressed, onKeyDown]);

    // Use group context values if available
    const finalSize = groupContext?.size || size;
    const finalVariant = groupContext?.variant || variant;
    const finalDisabled = groupContext?.disabled || disabled;

    // Determine if toggle is pressed in group context
    const isPressedInGroup = groupContext && props.value ? (
      groupContext.type === "single"
        ? groupContext.value === props.value
        : Array.isArray(groupContext.value) && groupContext.value.includes(props.value)
    ) : pressed;

    const finalPressed = groupContext ? isPressedInGroup : pressed;

    // Build toggle classes
    const toggleClasses = [
      toggleVariants.root.base,
      toggleVariants.root.sizes[finalSize],
      finalPressed
        ? toggleVariants.root.variants[finalVariant].pressed
        : toggleVariants.root.variants[finalVariant].default,
      finalDisabled && toggleVariants.root.disabled,
      className
    ].filter(Boolean).join(" ");

    return (
      <button
        ref={ref}
        id={toggleId}
        type="button"
        role="button"
        aria-pressed={finalPressed}
        disabled={finalDisabled}
        data-state={finalPressed ? "on" : "off"}
        data-pressed={finalPressed ? "" : undefined}
        className={toggleClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ToggleRoot.displayName = "Toggle";

// Toggle Group component
export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      type = "single",
      value: controlledValue,
      defaultValue,
      onValueChange,
      orientation = "horizontal",
      disabled = false,
      loop = true,
      rovingFocus = true,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    // Initialize default value based on type
    const getInitialValue = () => {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      return type === "single" ? "" : [];
    };

    // State management for controlled/uncontrolled
    const [internalValue, setInternalValue] = useState<string | string[]>(getInitialValue());
    const [activeIndex, setActiveIndex] = useState(-1);
    const [itemCount, setItemCount] = useState(0);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    // Handle value changes
    const handleValueChange = useCallback((itemValue: string) => {
      let newValue: string | string[];

      if (type === "single") {
        // Single selection: toggle the value
        newValue = value === itemValue ? "" : itemValue;
      } else {
        // Multiple selection: add/remove from array
        const currentArray = Array.isArray(value) ? value : [];
        newValue = currentArray.includes(itemValue)
          ? currentArray.filter(v => v !== itemValue)
          : [...currentArray, itemValue];
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }

      onValueChange?.(newValue);
    }, [type, value, isControlled, onValueChange]);

    // Generate unique ID
    const groupId = useId();

    const contextValue: ToggleGroupContextValue = {
      type,
      value,
      onValueChange: handleValueChange,
      disabled,
      size: "md", // Default for group
      variant: "default", // Default for group
      orientation,
      activeIndex,
      setActiveIndex,
      itemCount,
      setItemCount
    };

    // Build group classes
    const groupClasses = [
      toggleVariants.group.base,
      toggleVariants.group.orientations[orientation],
      toggleVariants.group.spacing[orientation],
      className
    ].filter(Boolean).join(" ");

    return (
      <ToggleGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          id={groupId}
          role="group"
          aria-orientation={orientation}
          data-orientation={orientation}
          className={groupClasses}
          {...props}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  }
);

ToggleGroup.displayName = "ToggleGroup";

// Toggle Group Item component
export const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  (props, ref) => {
    return <ToggleRoot ref={ref} {...props} />;
  }
);

ToggleGroupItem.displayName = "ToggleGroupItem";

// Compound component interface
interface ToggleComponent extends React.ForwardRefExoticComponent<ToggleProps & React.RefAttributes<HTMLButtonElement>> {
  Group: typeof ToggleGroup;
  GroupItem: typeof ToggleGroupItem;
}

// Compound component pattern - attach sub-components to main Toggle
const ToggleWithSubComponents = ToggleRoot as ToggleComponent;
ToggleWithSubComponents.Group = ToggleGroup;
ToggleWithSubComponents.GroupItem = ToggleGroupItem;

export { ToggleWithSubComponents as Toggle };

// Export types for external use
export type {
  ToggleProps,
  ToggleGroupProps,
  ToggleGroupItemProps,
  ToggleVariants
};