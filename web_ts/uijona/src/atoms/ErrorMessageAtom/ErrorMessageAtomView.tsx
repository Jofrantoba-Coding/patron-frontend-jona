// ErrorMessageAtomView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterErrorMessageAtom } from './InterErrorMessageAtom';

export const ErrorMessageAtomView: React.FC<InterErrorMessageAtom> = ({
  message, type = 'error', id, className,
}) => {
  if (!message) return null;
  return (
    <p
      id={id}
      role={type === 'error' ? 'alert' : undefined}
      className={cn(
        'text-xs',
        type === 'error' ? 'text-danger-500' : 'text-neutral-500',
        className
      )}
    >
      {message}
    </p>
  );
};
