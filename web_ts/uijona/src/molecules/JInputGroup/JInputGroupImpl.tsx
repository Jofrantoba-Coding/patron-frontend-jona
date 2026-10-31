// JInputGroupImpl.tsx — JONA Implementation
import React from 'react';
import { InterJInputGroup, JINPUTGROUP_DEFAULTS, JINPUTGROUP_LOOKUP_COLUMNS } from './InterJInputGroup';
import { JInputGroupView } from './JInputGroupView';

export const JInputGroupImpl: React.FC<InterJInputGroup> = ({ preset, columns, ...props }) => {
  const resolved = preset ?? JINPUTGROUP_DEFAULTS.preset;
  const template = columns ?? (resolved === 'lookup' ? JINPUTGROUP_LOOKUP_COLUMNS : undefined);
  return <JInputGroupView {...props} preset={resolved} template={template} />;
};

JInputGroupImpl.displayName = 'JInputGroup';
