// UiMenuShowcaseImpl.ts — Level 3: Organism / JONA Layer: Implementation
// Manages active section state. No external services needed.
import { useState } from 'react';
import { InterUiMenuShowcase } from './InterUiMenuShowcase';

export function useUiMenuShowcaseImpl(): InterUiMenuShowcase {
  const [activeSection, setActiveSection] = useState('buttons');

  function onSectionChange(sectionId: string): void {
    setActiveSection(sectionId);
    // Scroll to section anchor
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return { activeSection, onSectionChange };
}
