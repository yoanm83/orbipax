'use client';

import React from 'react';

/**
 * Placeholder Step 2 component for Actual implementation
 * This represents the "not yet implemented" state for Step 2
 * Used only for visual harness comparison
 */
export function Step2PlaceholderActual() {
  return (
    <div className="flex-1 w-full p-6">
      <div className="space-y-6">
        {/* Placeholder content mimicking expected structure */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Insurance & Eligibility</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-24 h-24 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Step 2: Insurance & Eligibility
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              This step has not been migrated to the OrbiPax Design System yet.
              The component will be implemented following Health Philosophy standards.
            </p>
            <div className="mt-6 space-y-2 text-xs text-gray-400">
              <p>• Government Coverage section</p>
              <p>• Eligibility Records section</p>
              <p>• Insurance Records section</p>
              <p>• Authorizations section</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}