import React from 'react';
import { InterJPanel, JPANEL_DEFAULTS } from './InterJPanel';
import { JPanelView } from './JPanelView';

export const JPanelImpl = React.forwardRef<HTMLElement, InterJPanel>(
  (props, ref) => <JPanelView ref={ref} {...JPANEL_DEFAULTS} {...props} />
);
JPanelImpl.displayName = 'JPanel';
