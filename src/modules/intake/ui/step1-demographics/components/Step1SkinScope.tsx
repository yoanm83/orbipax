'use client';

import React from 'react';

interface Step1SkinScopeProps {
  children: React.ReactNode;
}

/**
 * Step1SkinScope - Bridge variables wrapper for pixel parity with Legacy
 *
 * This component provides scoped CSS custom properties that map OrbiPax tokens
 * to match Legacy (Golden) visual appearance without changing global styles.
 */
export function Step1SkinScope({ children }: Step1SkinScopeProps) {
  return (
    <div
      className="step1-skin-scope"
      style={{
        // Bridge variables for Legacy parity
        // These map OrbiPax tokens to match Legacy appearance

        // Focus ring matching Legacy blue
        '--legacy-focus': '#4C6EF5',
        '--legacy-focus-offset': '4px',
        '--legacy-ring-width': '4px',

        // Card styling to match Legacy
        '--legacy-card-bg': 'white',
        '--legacy-card-padding': '1.5rem', // 24px = p-6
        '--legacy-card-radius': '1rem', // rounded-2xl in Legacy
        '--legacy-card-shadow': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // shadow-md

        // Border colors
        '--legacy-border': '#E5E7EB', // gray-200
        '--legacy-border-light': '#F9FAFB', // gray-100

        // Text colors matching Legacy
        '--legacy-text-primary': '#111827', // gray-900
        '--legacy-text-secondary': '#6B7280', // gray-500
        '--legacy-text-muted': '#9CA3AF', // gray-400

        // Input/control styling
        '--legacy-input-border': '#D1D5DB', // gray-300
        '--legacy-input-bg': 'white',
        '--legacy-input-radius': '0.375rem', // rounded-md
        '--legacy-input-padding-y': '0.5rem', // py-2
        '--legacy-input-padding-x': '0.75rem', // px-3

        // Hover states
        '--legacy-hover-bg': '#F9FAFB', // gray-50
        '--legacy-hover-border': '#9CA3AF', // gray-400

        // Primary color for icons/accents
        '--legacy-primary': '#3B82F6', // blue-500
        '--legacy-primary-hover': '#2563EB', // blue-600

        // Spacing adjustments
        '--legacy-section-gap': '1.5rem', // mb-6
        '--legacy-field-gap': '1rem', // space-y-4

        // Calendar-specific variables for CustomCalendar
        '--cal-fg': '#111827', // gray-900 - calendar text
        '--cal-bg': 'white', // calendar background
        '--cal-border': '#E5E7EB', // gray-200 - calendar borders
        '--cal-selected-bg': '#3B82F6', // blue-500 - selected date bg
        '--cal-selected-fg': 'white', // selected date text
        '--cal-today-ring': '#3B82F6', // blue-500 - today indicator
        '--cal-hover-bg': '#F3F4F6', // gray-100 - hover state
        '--cal-disabled-fg': '#9CA3AF', // gray-400 - disabled dates
        '--cal-radius': '0.375rem', // rounded-md for calendar cells
        '--cal-cell-min': '2.25rem', // 36px min cell size
        '--cal-nav-hover': '#F9FAFB', // gray-50 - nav button hover
        '--cal-weekday-fg': '#6B7280', // gray-500 - weekday headers

      } as React.CSSProperties}
    >
      <style jsx>{`
        /* Scoped style overrides for pixel parity */
        .step1-skin-scope {
          /* Ensure consistent base styling */
          color: var(--legacy-text-primary);
        }

        /* Card adjustments */
        .step1-skin-scope [class*="Card"] {
          background: var(--legacy-card-bg);
          border-radius: var(--legacy-card-radius);
          box-shadow: var(--legacy-card-shadow);
        }

        /* Focus state for all interactive elements - accessible ring */
        .step1-skin-scope button:focus-visible,
        .step1-skin-scope input:focus-visible,
        .step1-skin-scope select:focus-visible,
        .step1-skin-scope textarea:focus-visible,
        .step1-skin-scope [tabindex]:focus-visible,
        .step1-skin-scope [role="button"]:focus-visible {
          outline: 2px solid transparent !important;
          outline-offset: 2px !important;
          box-shadow:
            0 0 0 4px rgba(255, 255, 255, 1),
            0 0 0 6px var(--legacy-focus) !important;
        }

        /* Special focus for photo upload area matching Legacy */
        .step1-skin-scope .group:hover > div {
          box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }

        /* Input/control density matching */
        .step1-skin-scope input:not([type="checkbox"]):not([type="radio"]),
        .step1-skin-scope select,
        .step1-skin-scope textarea,
        .step1-skin-scope [role="combobox"] {
          padding: var(--legacy-input-padding-y) var(--legacy-input-padding-x);
          border-radius: var(--legacy-input-radius);
          border-color: var(--legacy-input-border);
          background: var(--legacy-input-bg);
          min-height: 2.5rem; /* 40px to match Legacy */
        }

        /* Select and MultiSelect specific adjustments */
        .step1-skin-scope [data-radix-select-trigger],
        .step1-skin-scope [role="combobox"] {
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.75rem;
        }

        /* Dropdown content density */
        .step1-skin-scope [role="listbox"] [role="option"],
        .step1-skin-scope [data-radix-select-content] [role="option"] {
          padding: 0.5rem 0.75rem;
          min-height: 2.25rem;
        }

        /* Label styling */
        .step1-skin-scope label {
          color: var(--legacy-text-primary);
          font-weight: 500;
        }

        /* Helper text */
        .step1-skin-scope [class*="text-muted"],
        .step1-skin-scope [class*="text-on-muted"] {
          color: var(--legacy-text-secondary);
        }

        /* Section headers */
        .step1-skin-scope h1,
        .step1-skin-scope h2 {
          color: var(--legacy-text-primary);
        }

        /* Icon colors */
        .step1-skin-scope svg {
          color: currentColor;
        }

        .step1-skin-scope [class*="text-primary"] svg {
          color: var(--legacy-primary);
        }

        /* Border adjustments for sections */
        .step1-skin-scope [class*="border-b"] {
          border-bottom-color: var(--legacy-border-light);
        }

        /* Photo upload area matching Legacy */
        .step1-skin-scope .w-36.h-36 {
          width: 9rem;
          height: 9rem;
        }

        /* Hover states for interactive elements */
        .step1-skin-scope button:hover:not(:disabled),
        .step1-skin-scope [role="button"]:hover {
          background-color: var(--legacy-hover-bg);
        }

        /* Disabled states */
        .step1-skin-scope button:disabled,
        .step1-skin-scope input:disabled,
        .step1-skin-scope select:disabled,
        .step1-skin-scope textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Error states */
        .step1-skin-scope .error input,
        .step1-skin-scope .error select,
        .step1-skin-scope .error textarea,
        .step1-skin-scope input[aria-invalid="true"],
        .step1-skin-scope select[aria-invalid="true"],
        .step1-skin-scope textarea[aria-invalid="true"] {
          border-color: #EF4444;
        }

        /* Ensure consistent line-height */
        .step1-skin-scope {
          line-height: 1.5;
        }

        /* Grid and flex gap adjustments */
        .step1-skin-scope [class*="space-y-4"] > * + * {
          margin-top: 1rem;
        }

        .step1-skin-scope [class*="gap-4"] {
          gap: 1rem;
        }

        /* Calendar-specific styles for CustomCalendar primitive */
        .step1-skin-scope [data-radix-popper-content-wrapper] {
          z-index: 50;
        }

        /* Calendar container */
        .step1-skin-scope .rdp {
          --rdp-cell-size: var(--cal-cell-min);
          --rdp-accent-color: var(--cal-selected-bg);
          --rdp-background-color: var(--cal-selected-bg);
          margin: 0;
          padding: 0.75rem;
          background: var(--cal-bg);
          color: var(--cal-fg);
        }

        /* Calendar navigation */
        .step1-skin-scope .rdp-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.5rem;
        }

        .step1-skin-scope .rdp-nav_button {
          width: 2rem;
          height: 2rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--cal-radius);
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          color: var(--cal-fg);
        }

        .step1-skin-scope .rdp-nav_button:hover {
          background: var(--cal-nav-hover);
          border-color: var(--cal-border);
        }

        /* Calendar month caption */
        .step1-skin-scope .rdp-caption_label {
          font-weight: 500;
          font-size: 0.875rem;
          color: var(--cal-fg);
        }

        /* Calendar table */
        .step1-skin-scope .rdp-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 0.5rem;
        }

        /* Weekday headers */
        .step1-skin-scope .rdp-head_cell {
          color: var(--cal-weekday-fg);
          font-size: 0.75rem;
          font-weight: 400;
          text-align: center;
          height: 2rem;
          padding: 0;
        }

        /* Calendar cells */
        .step1-skin-scope .rdp-cell {
          text-align: center;
          padding: 1px;
        }

        /* Day buttons */
        .step1-skin-scope .rdp-button {
          width: var(--cal-cell-min);
          height: var(--cal-cell-min);
          border-radius: var(--cal-radius);
          background: transparent;
          border: none;
          font-size: 0.875rem;
          color: var(--cal-fg);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        /* Day hover state */
        .step1-skin-scope .rdp-button:hover:not(.rdp-day_selected):not(:disabled) {
          background: var(--cal-hover-bg);
        }

        /* Selected day */
        .step1-skin-scope .rdp-day_selected .rdp-button {
          background: var(--cal-selected-bg) !important;
          color: var(--cal-selected-fg) !important;
          font-weight: 500;
        }

        /* Today indicator */
        .step1-skin-scope .rdp-day_today .rdp-button {
          position: relative;
        }

        .step1-skin-scope .rdp-day_today .rdp-button::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--cal-today-ring);
        }

        .step1-skin-scope .rdp-day_today.rdp-day_selected .rdp-button::after {
          background: var(--cal-selected-fg);
        }

        /* Disabled days */
        .step1-skin-scope .rdp-button:disabled {
          color: var(--cal-disabled-fg);
          cursor: not-allowed;
          opacity: 0.5;
        }

        /* Outside month days */
        .step1-skin-scope .rdp-day_outside .rdp-button {
          color: var(--cal-disabled-fg);
          opacity: 0.5;
        }

        /* Focus state for calendar days - accessible */
        .step1-skin-scope .rdp-button:focus-visible {
          outline: 2px solid transparent;
          outline-offset: 0;
          box-shadow: 0 0 0 2px var(--cal-bg), 0 0 0 4px var(--cal-selected-bg);
        }

        /* Calendar popover trigger button (Date field) */
        .step1-skin-scope button[aria-haspopup="dialog"][aria-expanded] {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: 2.5rem;
          padding: 0 0.75rem;
          border-radius: var(--legacy-input-radius);
          border: 1px solid var(--legacy-input-border);
          background: var(--legacy-input-bg);
          font-weight: normal;
        }

        .step1-skin-scope button[aria-haspopup="dialog"][aria-expanded]:hover {
          background: var(--legacy-hover-bg);
          border-color: var(--legacy-hover-border);
        }
      `}</style>
      {children}
    </div>
  );
}