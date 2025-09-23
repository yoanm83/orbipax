'use client';

import React, { useState, useRef, useEffect } from 'react';
import { mockInsuranceData, mockStep2Handlers } from './mockDataStep2';
import { Step2PlaceholderActual } from './Step2PlaceholderActual';
import dynamic from 'next/dynamic';

// Dynamically import legacy Step 2 to avoid build issues
const LegacyStep2 = dynamic(
  () => import('@/modules/legacy/intake/step2-eligibility-insurance/components/intake-step2-eligibility-insurance')
    .then(mod => ({ default: mod.IntakeStep2EligibilityInsurance })),
  {
    ssr: false,
    loading: () => <div className="p-4">Loading legacy Step 2...</div>
  }
);

export function Step2VisualHarness() {
  // State management for harness controls
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [showHover, setShowHover] = useState(false);
  const [showFocus, setShowFocus] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);
  const [showError, setShowError] = useState(false);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'overlay'>('side-by-side');

  const goldenRef = useRef<HTMLDivElement>(null);
  const actualRef = useRef<HTMLDivElement>(null);

  // Apply focus state programmatically
  useEffect(() => {
    if (showFocus) {
      // Find first focusable element and focus it
      const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const firstFocusable = actualRef.current?.querySelector(focusableElements) as HTMLElement;
      firstFocusable?.focus();

      const goldenFocusable = goldenRef.current?.querySelector(focusableElements) as HTMLElement;
      goldenFocusable?.focus();
    }
  }, [showFocus]);

  // CSS for scope isolation
  const scopeStyles = `
    <style>
      /* Legacy scope - preserve original styles */
      .legacy-scope {
        /* Reset some global styles that might interfere */
        all: initial;
        font-family: var(--font-family);
      }

      /* Actual scope - use current tokens */
      .actual-scope {
        /* Current implementation styles */
      }

      /* Hover simulation */
      .simulate-hover button:not(:disabled),
      .simulate-hover input:not(:disabled),
      .simulate-hover select:not(:disabled),
      .simulate-hover textarea:not(:disabled),
      .simulate-hover [role="button"]:not(:disabled),
      .simulate-hover a:not(:disabled) {
        filter: brightness(1.1);
        background-color: var(--hover-bg, rgba(0,0,0,0.05));
      }

      /* Focus simulation */
      .simulate-focus button,
      .simulate-focus input,
      .simulate-focus select,
      .simulate-focus textarea,
      .simulate-focus [role="button"] {
        outline: 2px solid var(--focus, #4C6EF5) !important;
        outline-offset: 2px !important;
      }

      /* Disabled simulation */
      .simulate-disabled button,
      .simulate-disabled input,
      .simulate-disabled select,
      .simulate-disabled textarea,
      .simulate-disabled [role="switch"] {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
        pointer-events: none !important;
      }

      /* Error simulation */
      .simulate-error input,
      .simulate-error select,
      .simulate-error textarea {
        border-color: var(--destructive, #EF4444) !important;
        background-color: #FEF2F2 !important;
      }

      /* Overlay mode styles */
      .overlay-container {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 1000px;
      }

      .overlay-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    </style>
  `;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div dangerouslySetInnerHTML={{ __html: scopeStyles }} />

      {/* Control Panel */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Step 2 Visual Harness Controls</h2>
        <div className="text-sm text-amber-600 mb-4 p-2 bg-amber-50 rounded">
          ⚠️ Note: Step 2 has not been migrated yet. Actual shows placeholder only.
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* View Mode */}
          <div>
            <label className="block text-sm font-medium mb-1">View Mode</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="side-by-side">Side by Side</option>
              <option value="overlay">Overlay</option>
            </select>
          </div>

          {/* Overlay Opacity */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Overlay Opacity: {overlayOpacity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(Number(e.target.value))}
              className="w-full"
              disabled={viewMode !== 'overlay'}
            />
          </div>

          {/* State Toggles */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">State Simulation</label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHover(!showHover)}
                className={`px-3 py-1 rounded ${showHover ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Hover
              </button>
              <button
                onClick={() => setShowFocus(!showFocus)}
                className={`px-3 py-1 rounded ${showFocus ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Focus
              </button>
              <button
                onClick={() => setShowDisabled(!showDisabled)}
                className={`px-3 py-1 rounded ${showDisabled ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Disabled
              </button>
              <button
                onClick={() => setShowError(!showError)}
                className={`px-3 py-1 rounded ${showError ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Error
              </button>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>• Use controls to compare visual states between Golden (Legacy) and Actual implementations</p>
          <p>• Overlay mode superimposes Actual over Golden for pixel-perfect comparison</p>
          <p>• Step 2 is pending migration - showing placeholder for Actual</p>
        </div>
      </div>

      {/* Comparison View */}
      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Golden (Legacy) */}
          <div>
            <h3 className="text-lg font-semibold mb-2 px-2">Golden (Legacy) - Full Implementation</h3>
            <div
              ref={goldenRef}
              className={`
                legacy-scope bg-white rounded-lg shadow-lg overflow-auto
                ${showHover ? 'simulate-hover' : ''}
                ${showFocus ? 'simulate-focus' : ''}
                ${showDisabled ? 'simulate-disabled' : ''}
                ${showError ? 'simulate-error' : ''}
              `}
            >
              <React.Suspense fallback={<div className="p-4">Loading...</div>}>
                <LegacyStep2 />
              </React.Suspense>
            </div>
          </div>

          {/* Actual (Migrated) */}
          <div>
            <h3 className="text-lg font-semibold mb-2 px-2">Actual (Migrated) - Placeholder</h3>
            <div
              ref={actualRef}
              className={`
                actual-scope bg-white rounded-lg shadow-lg overflow-auto
                ${showHover ? 'simulate-hover' : ''}
                ${showFocus ? 'simulate-focus' : ''}
                ${showDisabled ? 'simulate-disabled' : ''}
                ${showError ? 'simulate-error' : ''}
              `}
            >
              <Step2PlaceholderActual />
            </div>
          </div>
        </div>
      ) : (
        /* Overlay Mode */
        <div className="max-w-6xl mx-auto">
          <h3 className="text-lg font-semibold mb-2">Overlay Comparison (Actual over Golden)</h3>
          <div className="text-sm text-amber-600 mb-2">
            Note: Since Step 2 is not implemented, overlay shows placeholder over full legacy component
          </div>
          <div className="overlay-container bg-white rounded-lg shadow-lg">
            {/* Golden Base Layer */}
            <div className="overlay-layer">
              <div
                ref={goldenRef}
                className={`
                  legacy-scope h-full
                  ${showHover ? 'simulate-hover' : ''}
                  ${showFocus ? 'simulate-focus' : ''}
                  ${showDisabled ? 'simulate-disabled' : ''}
                  ${showError ? 'simulate-error' : ''}
                `}
              >
                <React.Suspense fallback={<div className="p-4">Loading...</div>}>
                  <LegacyStep2 />
                </React.Suspense>
              </div>
            </div>

            {/* Actual Overlay Layer */}
            <div
              className="overlay-layer"
              style={{
                opacity: overlayOpacity / 100,
                pointerEvents: overlayOpacity === 100 ? 'auto' : 'none'
              }}
            >
              <div
                ref={actualRef}
                className={`
                  actual-scope h-full bg-white
                  ${showHover ? 'simulate-hover' : ''}
                  ${showFocus ? 'simulate-focus' : ''}
                  ${showDisabled ? 'simulate-disabled' : ''}
                  ${showError ? 'simulate-error' : ''}
                `}
              >
                <Step2PlaceholderActual />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Difference Notes Section */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Step 2 Visual Differences Log</h3>
        <div className="space-y-2 text-sm">
          <div className="p-3 bg-amber-50 rounded">
            <p className="font-medium text-amber-800 mb-2">⚠️ Step 2 Not Yet Implemented</p>
            <p className="text-amber-700">
              The Actual version shows a placeholder as Step 2 has not been migrated to the OrbiPax Design System yet.
            </p>
          </div>

          <p className="text-gray-600 font-medium mt-4">Legacy Step 2 Structure (for future migration):</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li><strong>Government Coverage Section:</strong> Medicaid, Medicare, other government programs</li>
            <li><strong>Eligibility Records Section:</strong> Coverage verification records table</li>
            <li><strong>Insurance Records Section:</strong> Private insurance cards/plans table</li>
            <li><strong>Authorizations Section:</strong> Pre-authorization records table</li>
          </ul>

          <p className="text-gray-600 font-medium mt-4">Key Components to Migrate:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Switch components for boolean fields (has coverage)</li>
            <li>Date pickers for coverage periods</li>
            <li>Dynamic record tables with add/remove functionality</li>
            <li>Collapsible card sections with ChevronUp/Down icons</li>
            <li>Select dropdowns for plan types and relationships</li>
            <li>Textarea for notes and additional details</li>
          </ul>

          <p className="text-gray-600 font-medium mt-4">Expected Visual Elements (from Legacy):</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Cards: rounded-2xl, shadow-md, p-6 padding</li>
            <li>Section headers: flex justify-between with icons</li>
            <li>Tables: border-separate with hover states</li>
            <li>Buttons: Plus icon for add, X icon for remove</li>
            <li>Focus rings: Blue (#4C6EF5) with 4px offset</li>
            <li>Error states: Red borders with light red background</li>
          </ul>
        </div>
      </div>
    </div>
  );
}