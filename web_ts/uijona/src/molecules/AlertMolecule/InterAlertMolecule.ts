// InterAlertMolecule.ts — JONA Interface
import React from 'react';

export type AlertVariant = 'default' | 'destructive';

export interface InterAlertMolecule extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  icon?: React.ReactNode;
}

export const ALERT_MOLECULE_DEFAULTS: Required<Pick<InterAlertMolecule, 'variant'>> = {
  variant: 'default',
};
