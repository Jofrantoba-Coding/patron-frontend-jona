import React from 'react';
import { InterPanelAtom, PANEL_ATOM_DEFAULTS } from './InterPanelAtom';
import { JPanel } from '../JPanel';

export const PanelAtomImpl = React.forwardRef<HTMLElement, InterPanelAtom>(
  (props, ref) => <JPanel ref={ref} {...PANEL_ATOM_DEFAULTS} {...props} />
);
PanelAtomImpl.displayName = 'PanelAtom';
