// ErrorMessageAtom.tsx — Level 1: Atom
// Accessible error/description message for form fields.
import React from 'react';
import { cn } from '../lib/cn';

interface ErrorMessageAtomProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: string;
  type?: 'error' | 'description';
}

export const ErrorMessageAtom: React.FC<ErrorMessageAtomProps> = ({
  message,
  type = 'error',
  className,
  ...props
}) => {
  if (!message) return null;
  return (
    <p
      role={type === 'error' ? 'alert' : undefined}
      className={cn(
        'text-xs mt-1',
        type === 'error' ? 'text-danger-500' : 'text-neutral-500',
        className
      )}
      {...props}
    >
      {message}
    </p>
  );
};
