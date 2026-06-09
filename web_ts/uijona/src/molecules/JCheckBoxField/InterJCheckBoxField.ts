// InterJCheckBoxField.ts — JONA Interface

export interface InterJCheckBoxField {
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

export const JCHECKBOX_FIELD_DEFAULTS: Required<Pick<InterJCheckBoxField, 'checked' | 'disabled'>> = {
  checked:  false,
  disabled: false,
};
