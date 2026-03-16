// UiShowcaseImpl.ts — Level 3: Organism / JONA Layer: Implementation
// No external services needed for showcase — delegates to template hook.
import { useUiShowcase } from './UiShowcase';

export function useUiShowcaseImpl() {
  // Showcase has no external integrations — template behavior is sufficient.
  // This layer exists to honor the JONA archetype and allow future extension.
  return useUiShowcase();
}
