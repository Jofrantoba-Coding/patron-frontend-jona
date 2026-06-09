// JFaqItemImpl.tsx — JONA Implementation
import React from 'react';
import { InterJFaqItem, JFAQ_ITEM_DEFAULTS } from './InterJFaqItem';
import { JFaqItemView } from './JFaqItemView';

export const JFaqItemImpl: React.FC<InterJFaqItem> = (props) => (
  <JFaqItemView {...JFAQ_ITEM_DEFAULTS} {...props} />
);
