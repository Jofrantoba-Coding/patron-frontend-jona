// LinkAtomImpl.tsx — JONA Implementation
import React from 'react';
import { InterLinkAtom, LINK_ATOM_DEFAULTS } from './InterLinkAtom';
import { LinkAtomView } from './LinkAtomView';

export const LinkAtomImpl = React.forwardRef<HTMLAnchorElement, InterLinkAtom>(
  (props, ref) => <LinkAtomView {...LINK_ATOM_DEFAULTS} {...props} ref={ref} />
);

LinkAtomImpl.displayName = 'LinkAtom';
