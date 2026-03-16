// InterCheckboxFieldMolecule.ts — JONA Interface

export interface InterCheckboxFieldMolecule {
  id: string;
  label: string;
  checked?: boolean;
  description?: string;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
  // Observer events
  onCheckedChange?: (checked: boolean) => void;
}

export const CHECKBOX_FIELD_MOLECULE_DEFAULTS: Required<Pick<InterCheckboxFieldMolecule, 'checked' | 'disabled'>> = {
  checked:  false,
  disabled: false,
};
