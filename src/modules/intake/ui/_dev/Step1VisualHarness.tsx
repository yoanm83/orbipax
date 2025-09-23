'use client';

import React, { useState, useRef, useEffect } from 'react';
import { mockDemographicsData, mockHandlers } from './mockData';

// Import the actual component
import { IntakeWizardStep1Demographics as ActualStep1 } from '../step1-demographics/components/intake-wizard-step1-demographics';

// Import the legacy component
// Note: Legacy uses different imports, we'll need to mock/provide them
import dynamic from 'next/dynamic';

// Dynamically import legacy to avoid build issues
const LegacyStep1 = dynamic(
  () => import('@/modules/legacy/intake/step1-demographics/components/intake-wizard-step1-demographics')
    .then(mod => ({ default: mod.default || mod.IntakeWizardStep1Demographics })),
  {
    ssr: false,
    loading: () => <div className="p-4">Loading legacy component...</div>
  }
);

export function Step1VisualHarness() {
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
      .simulate-hover a:not(:disabled) {
        filter: brightness(1.1);
        background-color: var(--hover-bg, rgba(0,0,0,0.05));
      }

      /* Focus simulation */
      .simulate-focus button,
      .simulate-focus input,
      .simulate-focus select,
      .simulate-focus textarea {
        outline: 2px solid var(--focus, #4C6EF5) !important;
        outline-offset: 2px !important;
      }

      /* Disabled simulation */
      .simulate-disabled button,
      .simulate-disabled input,
      .simulate-disabled select,
      .simulate-disabled textarea {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
        pointer-events: none !important;
      }

      /* Error simulation */
      .simulate-error input,
      .simulate-error select,
      .simulate-error textarea {
        border-color: var(--destructive, #EF4444) !important;
      }

      /* Overlay mode styles */
      .overlay-container {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .overlay-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
    </style>
  `;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div dangerouslySetInnerHTML={{ __html: scopeStyles }} />

      {/* Control Panel */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Visual Harness Controls</h2>

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
        </div>
      </div>

      {/* Comparison View */}
      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Golden (Legacy) */}
          <div>
            <h3 className="text-lg font-semibold mb-2 px-2">Golden (Legacy)</h3>
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
                <LegacyStep1 />
              </React.Suspense>
            </div>
          </div>

          {/* Actual (Migrated) */}
          <div>
            <h3 className="text-lg font-semibold mb-2 px-2">Actual (Migrated)</h3>
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
              <ActualStep1 />
            </div>
          </div>
        </div>
      ) : (
        /* Overlay Mode */
        <div className="max-w-6xl mx-auto">
          <h3 className="text-lg font-semibold mb-2">Overlay Comparison (Actual over Golden)</h3>
          <div className="overlay-container bg-white rounded-lg shadow-lg" style={{ minHeight: '800px' }}>
            {/* Golden Base Layer */}
            <div className="overlay-layer">
              <div
                className={`
                  legacy-scope h-full
                  ${showHover ? 'simulate-hover' : ''}
                  ${showFocus ? 'simulate-focus' : ''}
                  ${showDisabled ? 'simulate-disabled' : ''}
                  ${showError ? 'simulate-error' : ''}
                `}
              >
                <React.Suspense fallback={<div className="p-4">Loading...</div>}>
                  <LegacyStep1 />
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
                <ActualStep1 />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Difference Notes Section */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Visual Differences Log</h3>
        <div className="space-y-2 text-sm">
          <p className="text-gray-600">Document observed differences here during manual testing:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Typography: Check font-family, size, weight, line-height</li>
            <li>Spacing: Padding, margins, gaps between elements</li>
            <li>Colors: Background, foreground, border colors</li>
            <li>Borders: Width, style, radius</li>
            <li>Shadows: Box-shadow differences</li>
            <li>Interactive states: Hover, focus, active, disabled</li>
            <li>Layout: Width, height, flexbox/grid differences</li>
          </ul>
        </div>
      </div>
    </div>
  );
}