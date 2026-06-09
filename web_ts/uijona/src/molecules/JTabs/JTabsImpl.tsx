// JTabsImpl.tsx — JONA Implementation
import React from 'react';
import { InterJTabs, JTABS_DEFAULTS } from './InterJTabs';
import { JTabsView, JTabsListView, JTabsTriggerView, JTabsContentView } from './JTabsView';

export const JTabsImpl: React.FC<InterJTabs> = (props) => (
  <JTabsView {...JTABS_DEFAULTS} {...props} />
);
JTabsImpl.displayName = 'JTabs';

export const JTabsListImpl: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <JTabsListView {...props} />
);
JTabsListImpl.displayName = 'JTabsList';

export const JTabsTriggerImpl: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }> = (props) => (
  <JTabsTriggerView {...props} />
);
JTabsTriggerImpl.displayName = 'JTabsTrigger';

export const JTabsContentImpl: React.FC<React.HTMLAttributes<HTMLDivElement> & { value: string }> = (props) => (
  <JTabsContentView {...props} />
);
JTabsContentImpl.displayName = 'JTabsContent';
