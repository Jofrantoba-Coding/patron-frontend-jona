// InterLabelAtom.ts — JONA Interface
import React from 'react';

export interface InterLabelAtom {
  htmlFor?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}
