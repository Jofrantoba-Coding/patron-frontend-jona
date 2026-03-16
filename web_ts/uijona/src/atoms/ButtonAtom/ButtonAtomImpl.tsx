// ButtonAtomImpl.tsx — JONA Implementation
import React from 'react';
import { InterButtonAtom, BUTTON_ATOM_DEFAULTS } from './InterButtonAtom';
import { ButtonAtomView } from './ButtonAtomView';

type ButtonAtomImplProps = InterButtonAtom & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof InterButtonAtom>;

export const ButtonAtomImpl = React.forwardRef<HTMLButtonElement, ButtonAtomImplProps>(
  (props, ref) => (
    <ButtonAtomView {...BUTTON_ATOM_DEFAULTS} {...props} forwardedRef={ref} />
  )
);

ButtonAtomImpl.displayName = 'ButtonAtom';
