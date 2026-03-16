// InputAtom.tsx — Level 1: Atom
// Indivisible text input element. No business logic.
import React from 'react';

interface InputAtomProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
}

export const InputAtom: React.FC<InputAtomProps> = ({
  id,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  disabled = false,
  hasError = false,
}) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`
        block w-full px-3 py-2.5 text-sm rounded-token-md border
        bg-neutral-50 text-neutral-900
        focus:ring-2 focus:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${hasError
          ? 'border-danger-500 focus:ring-danger-500'
          : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'}
      `}
    />
  );
};
