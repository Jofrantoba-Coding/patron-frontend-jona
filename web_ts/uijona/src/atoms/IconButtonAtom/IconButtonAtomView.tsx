// IconButtonAtomView.tsx — JONA View (render puro)
import React from 'react';
import { JButton } from '../JButton';
import { InterIconButtonAtom } from './InterIconButtonAtom';

export const IconButtonAtomView = React.forwardRef<HTMLButtonElement, InterIconButtonAtom>(
  ({ icon, label, variant = 'ghost', loading, ...props }, ref) => (
    <JButton ref={ref} type="button" size="icon" variant={variant} loading={loading} aria-label={label} {...props}>
      {!loading && icon}
    </JButton>
  )
);

IconButtonAtomView.displayName = 'IconButtonAtomView';
