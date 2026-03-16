// InterUiMenuShowcase.ts — Level 3: Organism / JONA Layer: Interface (Contract)
// Contract for the showcase navigation menu organism.
export interface InterUiMenuShowcase {
  /** Currently active section id */
  activeSection: string;
  /** Navigate to a section */
  onSectionChange: (sectionId: string) => void;
}
