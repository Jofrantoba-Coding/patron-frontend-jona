// IconButtonAtomImpl.tsx — JONA Implementation
import React from 'react';
import { ICON_BUTTON_ATOM_DEFAULTS, InterIconButtonAtom } from './InterIconButtonAtom';
import { IconButtonAtomView } from './IconButtonAtomView';

export const IconButtonAtomImpl = React.forwardRef<HTMLButtonElement, InterIconButtonAtom>(
  (props, ref) => <IconButtonAtomView {...ICON_BUTTON_ATOM_DEFAULTS} {...props} ref={ref} />
);

IconButtonAtomImpl.displayName = 'IconButtonAtom';
