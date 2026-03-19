import type { InputHTMLAttributes } from 'react';

export interface InputAtomProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function InputAtom({ hasError = false, className = '', ...props }: InputAtomProps) {
  const classes = ['input-atom', hasError ? 'input-atom--error' : '', className]
    .filter(Boolean)
    .join(' ');

  return <input className={classes} {...props} />;
}
