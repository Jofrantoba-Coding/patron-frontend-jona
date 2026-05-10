import React from 'react';

export type TableResponsiveMode = 'scroll' | 'cards' | 'none';

export interface TableContextValue {
  responsiveMode: TableResponsiveMode;
  labelsRef: React.MutableRefObject<string[]>;
}

export interface InterTableMolecule extends React.TableHTMLAttributes<HTMLTableElement> {
  responsiveMode?: TableResponsiveMode;
  wrapperClassName?: string;
}

export const TABLE_MOLECULE_DEFAULTS: Required<Pick<InterTableMolecule, 'responsiveMode'>> = {
  responsiveMode: 'scroll',
};
