import type { Config } from 'tailwindcss'

// OrbiPax Tailwind Configuration
// This repo uses one globals.css entry point; tokens live in CSS variables
// All colors use OKLCH values via CSS custom properties - no hardcoded hex values
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    // Custom breakpoints optimized for CMH applications 2025
    screens: {
      'sm': '640px',   // Mobile/Tablet portrait
      'md': '768px',   // Tablet landscape
      'lg': '1024px',  // Small desktop
      'xl': '1280px',  // Standard laptop
      '2xl': '1600px', // Desktop standard (recommended)
      '3xl': '1920px', // Large desktop
      '4xl': '2560px', // 4K displays
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
        "3xl": "8rem",
        "4xl": "10rem",
      },
      screens: {
        "2xl": "1400px",
        "3xl": "1800px",
        "4xl": "2400px",
      },
    },
    extend: {
      colors: {
        // All colors reference CSS variables with OKLCH values
        background: "var(--bg)",
        foreground: "var(--fg)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-fg)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-fg)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-fg)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-fg)",
        },
        border: "var(--border)",
        ring: "var(--ring)",
        focus: "var(--focus)",
      },
      fontFamily: {
        // System font stack for performance and accessibility
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      fontSize: {
        // Typography scale mapped to CSS custom properties
        "step--1": "var(--step--1)",
        "step-0": "var(--step-0)",
        "step-1": "var(--step-1)",
        "step-2": "var(--step-2)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-in-out",
        "fade-out": "fade-out 0.2s ease-in-out",
      },
    },
  },
  plugins: [
    // Container queries plugin for healthcare devices
    require('@tailwindcss/container-queries'),
  ],
} satisfies Config

export default config