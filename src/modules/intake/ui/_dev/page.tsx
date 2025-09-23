// Development page to mount the visual harness
// This should NOT be exposed in production
// Access via: /dev/harness/step1 (or similar dev route)

'use client';

import { Step1VisualHarness } from './Step1VisualHarness';

export default function HarnessPage() {
  return <Step1VisualHarness />;
}