// JUserAvatarImpl.tsx — JONA Implementation
import React from 'react';
import { InterJUserAvatar, JUSERAVATAR_DEFAULTS } from './InterJUserAvatar';
import { JUserAvatarView } from './JUserAvatarView';

export const JUserAvatarImpl: React.FC<InterJUserAvatar> = (props) => (
  <JUserAvatarView {...JUSERAVATAR_DEFAULTS} {...props} />
);
JUserAvatarImpl.displayName = 'JUserAvatar';
