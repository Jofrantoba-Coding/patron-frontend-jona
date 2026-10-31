// InterJField.ts — JONA Interface
import React from 'react';

export type JFieldSpan = 3 | 4 | 6 | 12;
export type JFieldAs = 'field' | 'fieldset';

/** The wiring a `JField` hands to its control (render-prop children, D11). */
export interface JFieldControlProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  'aria-required'?: true;
}

export interface InterJField {
  /** Id of the control; the label, help and error ids derive from it. */
  id: string;
  label: string;
  required?: boolean;
  /** Hover hint of the `*` marker; the control itself carries `aria-required`. */
  requiredLabel?: string;
  description?: string;
  /** Field error: part of the control's description, never a live region (R-FRM-1). */
  error?: string;
  /** Columns taken in a `JFieldGrid` from `md`; below `md` every field spans 12. */
  span?: JFieldSpan;
  /** `fieldset` names a group of controls (radios, checkboxes) with a legend. */
  as?: JFieldAs;
  children: (aria: JFieldControlProps) => React.ReactNode;
}

export const JFIELD_DEFAULTS = {
  requiredLabel: 'obligatorio',
  span: 6,
  as: 'field',
} as const satisfies Required<Pick<InterJField, 'requiredLabel' | 'span' | 'as'>>;
