import type { LabelHTMLAttributes, PropsWithChildren } from 'react';

export interface LabelAtomProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function LabelAtom({
  required = false,
  className = '',
  children,
  ...props
}: PropsWithChildren<LabelAtomProps>) {
  const classes = ['label-atom', className].filter(Boolean).join(' ');

  return (
    <label className={classes} {...props}>
      <span>{children}</span>
      {required ? <span className="label-atom__required">*</span> : null}
    </label>
  );
}
