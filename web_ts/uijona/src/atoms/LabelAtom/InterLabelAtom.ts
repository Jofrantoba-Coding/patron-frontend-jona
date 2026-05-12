// InterLabelAtom.ts — JONA Interface
import React from 'react';

export interface InterLabelAtom extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'children'> {
  required?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}
