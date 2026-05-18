import React from 'react';
import { InterJAvatar, JAVATAR_DEFAULTS } from './InterJAvatar';
import { JAvatarView } from './JAvatarView';

export const JAvatarImpl = React.forwardRef<HTMLDivElement, InterJAvatar>(
  (props, ref) => <JAvatarView {...JAVATAR_DEFAULTS} {...props} forwardedRef={ref} />
);
JAvatarImpl.displayName = 'JAvatar';
