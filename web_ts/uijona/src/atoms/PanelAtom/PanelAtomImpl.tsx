import React from 'react';
import { InterPanelAtom, PANEL_ATOM_DEFAULTS } from './InterPanelAtom';
import { PanelAtomView } from './PanelAtomView';

export const PanelAtomImpl = React.forwardRef<HTMLDivElement, InterPanelAtom>(
  (props, ref) => <PanelAtomView ref={ref} {...PANEL_ATOM_DEFAULTS} {...props} />
);
PanelAtomImpl.displayName = 'PanelAtom';
