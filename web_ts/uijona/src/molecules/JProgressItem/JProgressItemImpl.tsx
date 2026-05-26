// JProgressItemImpl.tsx — JONA Implementation
import React from 'react';
import { InterJProgressItem, JPROGRESS_ITEM_DEFAULTS } from './InterJProgressItem';
import { JProgressItemView } from './JProgressItemView';

export const JProgressItemImpl: React.FC<InterJProgressItem> = (props) => (
  <JProgressItemView {...JPROGRESS_ITEM_DEFAULTS} {...props} />
);

JProgressItemImpl.displayName = 'JProgressItem';
