import React from 'react';

export type JSeparatorOrientation = 'horizontal' | 'vertical';

export interface InterJSeparator {
  orientation?: JSeparatorOrientation;
  className?: string;
  style?: React.CSSProperties;
}

export const JSEPARATOR_DEFAULTS = {
  orientation: 'horizontal',
} as const satisfies Partial<InterJSeparator>;
