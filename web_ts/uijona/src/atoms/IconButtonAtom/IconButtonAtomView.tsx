// IconButtonAtomView.tsx — JONA View (render puro)
import React from 'react';
import { ButtonAtom } from '../ButtonAtom';
import { InterIconButtonAtom } from './InterIconButtonAtom';

export const IconButtonAtomView = React.forwardRef<HTMLButtonElement, InterIconButtonAtom>(
  ({ icon, label, variant = 'ghost', loading, ...props }, ref) => (
    <ButtonAtom ref={ref} type="button" size="icon" variant={variant} loading={loading} aria-label={label} {...props}>
      {!loading && icon}
    </ButtonAtom>
  )
);

IconButtonAtomView.displayName = 'IconButtonAtomView';
