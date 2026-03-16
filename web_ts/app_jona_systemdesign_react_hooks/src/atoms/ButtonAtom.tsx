// ButtonAtom.tsx — Level 1: Atom
// Indivisible action element. No business logic.
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonAtomProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
  secondary: 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700 focus:ring-neutral-300',
  danger:    'bg-danger-500 hover:bg-danger-600 text-white focus:ring-danger-500',
};

export const ButtonAtom: React.FC<ButtonAtomProps> = ({
  label,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  fullWidth = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        px-5 py-2.5 rounded-token-md text-sm font-medium
        focus:ring-4 focus:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
      `}
    >
      {label}
    </button>
  );
};
