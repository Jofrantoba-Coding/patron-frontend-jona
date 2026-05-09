// InterIconButtonAtom.ts — JONA Interface
import React from 'react';
import { ButtonVariant } from '../ButtonAtom';

export interface InterIconButtonAtom extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: React.ReactNode;
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
}

export const ICON_BUTTON_ATOM_DEFAULTS: Required<Pick<InterIconButtonAtom, 'variant' | 'loading'>> = {
  variant: 'ghost',
  loading: false,
};
