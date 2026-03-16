import React from 'react';
import { cn } from '../lib/cn';

interface LabelAtomProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const LabelAtom = React.forwardRef<HTMLLabelElement, LabelAtomProps>(
  ({ required, className, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('text-sm font-medium text-neutral-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5 text-danger-500" aria-hidden="true">*</span>}
    </label>
  )
);

LabelAtom.displayName = 'LabelAtom';
