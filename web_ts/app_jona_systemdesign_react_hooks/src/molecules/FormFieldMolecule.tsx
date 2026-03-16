// FormFieldMolecule.tsx — Level 2: Molecule
// Combines LabelAtom + InputAtom + ErrorMessageAtom into a cohesive form field.
// No business logic — only composes Atoms.
import React from 'react';
import { LabelAtom } from '../atoms/LabelAtom';
import { InputAtom } from '../atoms/InputAtom';
import { ErrorMessageAtom } from '../atoms/ErrorMessageAtom';

interface FormFieldMoleculeProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  errorMessage?: string;
  disabled?: boolean;
}

export const FormFieldMolecule: React.FC<FormFieldMoleculeProps> = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  errorMessage,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <LabelAtom htmlFor={id} text={label} />
      <InputAtom
        id={id}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        hasError={!!errorMessage}
      />
      <ErrorMessageAtom message={errorMessage} />
    </div>
  );
};
