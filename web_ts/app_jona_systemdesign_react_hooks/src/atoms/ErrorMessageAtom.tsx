// ErrorMessageAtom.tsx — Level 1: Atom
// Displays a validation error message. No business logic.
import React from 'react';

interface ErrorMessageAtomProps {
  message?: string;
}

export const ErrorMessageAtom: React.FC<ErrorMessageAtomProps> = ({ message }) => {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-danger-500" role="alert">
      {message}
    </p>
  );
};
