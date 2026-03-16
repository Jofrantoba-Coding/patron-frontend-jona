// UiMenuShowcaseView.tsx — Level 5: Page / JONA Layer: View_Orchestrator
// Assembles menu + showcase content inside BorderLayout.
// Registered as route /menu-showcase in App.tsx.
import React from 'react';
import BorderLayout from '../../uilayouts/BorderLayout';
import { UiMenuShowcase } from './UiMenuShowcase';
import { useUiMenuShowcaseImpl } from './UiMenuShowcaseImpl';
import { UiMenuShowcaseContent } from './UiMenuShowcaseContent';

export const UiMenuShowcaseView: React.FC = () => {
  const impl = useUiMenuShowcaseImpl();

  return (
    <BorderLayout
      north={<span className="font-semibold text-lg">JONA Design System — Showcase</span>}
      south={<span>© 2026 JONA Pattern — @jofrantoba</span>}
      west={
        <UiMenuShowcase
          activeSection={impl.activeSection}
          onSectionChange={impl.onSectionChange}
        />
      }
      center={
        <UiMenuShowcaseContent
          activeSection={impl.activeSection}
          onSectionChange={impl.onSectionChange}
        />
      }
    />
  );
};
