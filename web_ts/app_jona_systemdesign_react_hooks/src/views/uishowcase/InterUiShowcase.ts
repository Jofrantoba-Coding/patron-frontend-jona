// InterUiShowcase.ts — Level 3: Organism / JONA Layer: Interface (Contract)
// Contract for the component showcase organism.
export interface InterUiShowcase {
  openDialog: () => void;
  closeDialog: () => void;
  onRoleChange: (value: string) => void;
  onTermsChange: (checked: boolean) => void;
}
