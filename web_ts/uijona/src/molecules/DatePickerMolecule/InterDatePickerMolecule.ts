// InterDatePickerMolecule.ts — JONA Interface + defaults

export interface InterDatePickerMolecule {
  value?: string;           // ISO date string 'YYYY-MM-DD'
  min?: string;             // ISO date string, inclusive
  max?: string;             // ISO date string, inclusive
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (value: string) => void;
}

export const DATE_PICKER_MOLECULE_DEFAULTS: Required<Pick<InterDatePickerMolecule,
  'placeholder' | 'disabled'
>> = {
  placeholder: 'Seleccionar fecha',
  disabled: false,
};
