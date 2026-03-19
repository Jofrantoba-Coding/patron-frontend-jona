import type { ChangeEventHandler } from 'react';
import { ErrorMessageAtom } from '../atoms/ErrorMessageAtom';
import { InputAtom } from '../atoms/InputAtom';
import { LabelAtom } from '../atoms/LabelAtom';

export interface FormFieldMoleculeProps {
  id: string;
  label: string;
  type?: 'email' | 'password' | 'text';
  value: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  onChange: (value: string) => void;
}

export function FormFieldMolecule({
  id,
  label,
  type = 'text',
  value,
  placeholder,
  autoComplete,
  required = false,
  disabled = false,
  errorMessage,
  onChange,
}: FormFieldMoleculeProps) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className="field-molecule">
      <LabelAtom htmlFor={id} required={required}>
        {label}
      </LabelAtom>
      <InputAtom
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        hasError={Boolean(errorMessage)}
        onChange={handleChange}
      />
      <ErrorMessageAtom message={errorMessage} />
    </div>
  );
}
