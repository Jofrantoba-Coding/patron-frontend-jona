import React from 'react';
import { JLabelImpl } from '../JLabel/JLabelImpl';
import { InterLinkAtom, LinkVariant } from './InterLinkAtom';
import type { JLabelVariant } from '../JLabel/InterJLabel';

const LINK_VARIANT_MAP: Record<LinkVariant, JLabelVariant> = {
  'default': 'link',
  'muted':   'link-muted',
  'button':  'link-button',
  'danger':  'link-danger',
};

export const LinkAtomImpl = React.forwardRef<HTMLElement, InterLinkAtom>(
  ({ variant = 'default', disabled = false, children, ...rest }, ref) => (
    <JLabelImpl
      ref={ref}
      variant={LINK_VARIANT_MAP[variant]}
      disabled={disabled}
      {...(rest as any)}
    >
      {children}
    </JLabelImpl>
  )
);

LinkAtomImpl.displayName = 'LinkAtom';
