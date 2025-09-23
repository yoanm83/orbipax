"use client";

import { forwardRef, createContext, useContext } from "react";

// Typography Variants Type
export interface TypographyVariants {
  variant:
    | "display-xl" | "display-l" | "display-m" | "display-s"
    | "headline-h1" | "headline-h2" | "headline-h3" | "headline-h4" | "headline-h5" | "headline-h6"
    | "title-l" | "title-m" | "title-s"
    | "body-l" | "body-m" | "body-s"
    | "label-l" | "label-m" | "label-s"
    | "caption-l" | "caption-m" | "caption-s";
  weight?: "light" | "regular" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right" | "justify";
  color?: "default" | "muted" | "primary" | "success" | "warning" | "error";
}

// Typography Context
interface TypographyContextValue {
  variant: TypographyVariants["variant"];
  weight?: TypographyVariants["weight"];
  align?: TypographyVariants["align"];
  color?: TypographyVariants["color"];
}

const TypographyContext = createContext<TypographyContextValue | undefined>(undefined);

export const useTypographyContext = () => {
  const context = useContext(TypographyContext);
  if (!context) {
    throw new Error("Typography compound components must be used within Typography component");
  }
  return context;
};

// Base Typography Props
interface BaseTypographyProps extends React.HTMLAttributes<HTMLElement>, TypographyVariants {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

// Typography Root Component
const TypographyRoot = forwardRef<HTMLElement, BaseTypographyProps>(
  (
    {
      variant = "body-m",
      weight,
      align = "left",
      color = "default",
      as,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const contextValue: TypographyContextValue = {
      variant,
      weight,
      align,
      color
    };

    // Determine semantic HTML element
    const getSemanticElement = (): keyof JSX.IntrinsicElements => {
      if (as) {return as;}

      if (variant.startsWith("display")) {return "h1";}
      if (variant === "headline-h1") {return "h1";}
      if (variant === "headline-h2") {return "h2";}
      if (variant === "headline-h3") {return "h3";}
      if (variant === "headline-h4") {return "h4";}
      if (variant === "headline-h5") {return "h5";}
      if (variant === "headline-h6") {return "h6";}
      if (variant.startsWith("title")) {return "h3";}
      if (variant.startsWith("body")) {return "p";}
      if (variant.startsWith("label")) {return "span";}
      if (variant.startsWith("caption")) {return "small";}

      return "p";
    };

    // Typography variant styles
    const getVariantStyles = () => {
      const variants = {
        // Display variants
        "display-xl": "text-display-xl font-bold leading-tight tracking-tight",
        "display-l": "text-display-l font-bold leading-tight tracking-tight",
        "display-m": "text-display-m font-bold leading-tight tracking-tight",
        "display-s": "text-display-s font-bold leading-tight tracking-tight",

        // Headline variants
        "headline-h1": "text-headline-h1 font-bold leading-tight tracking-tight",
        "headline-h2": "text-headline-h2 font-semibold leading-tight tracking-tight",
        "headline-h3": "text-headline-h3 font-semibold leading-snug tracking-normal",
        "headline-h4": "text-headline-h4 font-semibold leading-snug tracking-normal",
        "headline-h5": "text-headline-h5 font-medium leading-snug tracking-normal",
        "headline-h6": "text-headline-h6 font-medium leading-normal tracking-normal",

        // Title variants
        "title-l": "text-title-l font-semibold leading-snug tracking-normal",
        "title-m": "text-title-m font-semibold leading-snug tracking-normal",
        "title-s": "text-title-s font-medium leading-normal tracking-normal",

        // Body variants
        "body-l": "text-body-l font-normal leading-relaxed tracking-normal",
        "body-m": "text-body-m font-normal leading-relaxed tracking-normal",
        "body-s": "text-body-s font-normal leading-normal tracking-normal",

        // Label variants
        "label-l": "text-label-l font-medium leading-normal tracking-normal",
        "label-m": "text-label-m font-medium leading-normal tracking-normal",
        "label-s": "text-label-s font-medium leading-tight tracking-normal",

        // Caption variants
        "caption-l": "text-caption-l font-normal leading-normal tracking-normal",
        "caption-m": "text-caption-m font-normal leading-normal tracking-wide",
        "caption-s": "text-caption-s font-normal leading-tight tracking-wide"
      };

      return variants[variant] || variants["body-m"];
    };

    // Weight override styles
    const getWeightStyles = () => {
      if (!weight) {return "";}

      const weights = {
        light: "font-light",
        regular: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold"
      };

      return weights[weight];
    };

    // Alignment styles
    const getAlignStyles = () => {
      const alignments = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
        justify: "text-justify"
      };

      return alignments[align];
    };

    // Color styles
    const getColorStyles = () => {
      const colors = {
        default: "text-fg",
        muted: "text-on-muted",
        primary: "text-primary",
        success: "text-success",
        warning: "text-warning",
        error: "text-error"
      };

      return colors[color];
    };

    // Combine all styles
    const combinedStyles = [
      getVariantStyles(),
      getWeightStyles(),
      getAlignStyles(),
      getColorStyles(),
      className
    ].filter(Boolean).join(" ");

    const Element = getSemanticElement();

    return (
      <TypographyContext.Provider value={contextValue}>
        <Element
          ref={ref as any}
          className={combinedStyles}
          {...props}
        >
          {children}
        </Element>
      </TypographyContext.Provider>
    );
  }
);

TypographyRoot.displayName = "Typography";

// Display Components
export interface DisplayProps extends Omit<BaseTypographyProps, "variant"> {
  size?: "xl" | "l" | "m" | "s";
}

const Display = forwardRef<HTMLElement, DisplayProps>(
  ({ size = "l", ...props }, ref) => {
    return (
      <TypographyRoot
        ref={ref}
        variant={`display-${size}` as TypographyVariants["variant"]}
        as="h1"
        {...props}
      />
    );
  }
);

Display.displayName = "Typography.Display";

// Headline Components
export interface HeadlineProps extends Omit<BaseTypographyProps, "variant"> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Headline = forwardRef<HTMLElement, HeadlineProps>(
  ({ level = 1, ...props }, ref) => {
    return (
      <TypographyRoot
        ref={ref}
        variant={`headline-h${level}` as TypographyVariants["variant"]}
        as={`h${level}` as keyof JSX.IntrinsicElements}
        {...props}
      />
    );
  }
);

Headline.displayName = "Typography.Headline";

// Title Components
export interface TitleProps extends Omit<BaseTypographyProps, "variant"> {
  size?: "l" | "m" | "s";
}

const Title = forwardRef<HTMLElement, TitleProps>(
  ({ size = "m", ...props }, ref) => {
    return (
      <TypographyRoot
        ref={ref}
        variant={`title-${size}` as TypographyVariants["variant"]}
        as="h3"
        {...props}
      />
    );
  }
);

Title.displayName = "Typography.Title";

// Body Components
export interface BodyProps extends Omit<BaseTypographyProps, "variant"> {
  size?: "l" | "m" | "s";
}

const Body = forwardRef<HTMLElement, BodyProps>(
  ({ size = "m", ...props }, ref) => {
    return (
      <TypographyRoot
        ref={ref}
        variant={`body-${size}` as TypographyVariants["variant"]}
        as="p"
        {...props}
      />
    );
  }
);

Body.displayName = "Typography.Body";

// Label Components
export interface LabelProps extends Omit<BaseTypographyProps, "variant"> {
  size?: "l" | "m" | "s";
}

const Label = forwardRef<HTMLElement, LabelProps>(
  ({ size = "m", ...props }, ref) => {
    return (
      <TypographyRoot
        ref={ref}
        variant={`label-${size}` as TypographyVariants["variant"]}
        as="span"
        {...props}
      />
    );
  }
);

Label.displayName = "Typography.Label";

// Caption Components
export interface CaptionProps extends Omit<BaseTypographyProps, "variant"> {
  size?: "l" | "m" | "s";
}

const Caption = forwardRef<HTMLElement, CaptionProps>(
  ({ size = "m", ...props }, ref) => {
    return (
      <TypographyRoot
        ref={ref}
        variant={`caption-${size}` as TypographyVariants["variant"]}
        as="small"
        {...props}
      />
    );
  }
);

Caption.displayName = "Typography.Caption";

// Export compound component
export const Typography = Object.assign(TypographyRoot, {
  Display,
  Headline,
  Title,
  Body,
  Label,
  Caption
});

// Export types
export type {
  BaseTypographyProps as TypographyProps,
  DisplayProps,
  HeadlineProps,
  TitleProps,
  BodyProps,
  LabelProps,
  CaptionProps
};