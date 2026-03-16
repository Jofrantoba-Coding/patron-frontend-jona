// LabelAtomView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterLabelAtom } from './InterLabelAtom';

export const LabelAtomView: React.FC<InterLabelAtom> = ({
  htmlFor, required = false, disabled = false, className, children,
}) => (
  <label
    htmlFor={htmlFor}
    className={cn(
      'text-sm font-medium text-neutral-700 leading-none',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    )}
  >
    {children}
    {required && <span className="ml-0.5 text-danger-500" aria-hidden="true">*</span>}
  </label>
);
