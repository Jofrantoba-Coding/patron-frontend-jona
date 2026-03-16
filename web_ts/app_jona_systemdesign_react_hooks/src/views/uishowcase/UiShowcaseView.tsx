// UiShowcaseView.tsx — Level 5: Page / JONA Layer: View_Orchestrator
// Registered as route /showcase in App.tsx.
import React from 'react';
import BorderLayout from '../../uilayouts/BorderLayout';
import { UiShowcase } from './UiShowcase';
import { useUiShowcaseImpl } from './UiShowcaseImpl';

export const UiShowcaseView: React.FC = () => {
  const impl = useUiShowcaseImpl();
  return (
    <BorderLayout
      north={<span className="font-semibold text-lg">JONA System Design</span>}
      south={<span>© 2026 JONA Pattern — @jofrantoba</span>}
      center={<UiShowcase {...impl} />}
    />
  );
};
