// JRelatedItemImpl.tsx — JONA Implementation
import React from 'react';
import { InterJRelatedItem, JRELATED_ITEM_DEFAULTS } from './InterJRelatedItem';
import { JRelatedItemView } from './JRelatedItemView';

export const JRelatedItemImpl: React.FC<InterJRelatedItem> = (props) => (
  <JRelatedItemView {...JRELATED_ITEM_DEFAULTS} {...props} />
);
