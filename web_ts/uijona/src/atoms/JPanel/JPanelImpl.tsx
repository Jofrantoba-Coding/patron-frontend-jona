import React from 'react';
import { InterJPanel, JPANEL_DEFAULTS } from './InterJPanel';
import { JPanelView } from './JPanelView';

type JPanelImplProps = InterJPanel &
  Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'style' | 'children'>;

export const JPanelImpl = React.forwardRef<HTMLElement, JPanelImplProps>(
  (props, ref) => <JPanelView {...JPANEL_DEFAULTS} {...props} forwardedRef={ref} />
);
JPanelImpl.displayName = 'JPanel';
