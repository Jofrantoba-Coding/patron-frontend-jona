// JTabsImpl.tsx — JONA Implementation
import React, { useId } from 'react';
import { InterJTabs, InterJTabsTrigger, JTABS_DEFAULTS, JTABS_TRIGGER_DEFAULTS } from './InterJTabs';
import { JTabsView, JTabsListView, JTabsTriggerView, JTabsContentView } from './JTabsView';

export const JTabsImpl: React.FC<InterJTabs> = (props) => (
  <JTabsView {...JTABS_DEFAULTS} {...props} />
);
JTabsImpl.displayName = 'JTabs';

export const JTabsListImpl: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <JTabsListView {...props} />
);
JTabsListImpl.displayName = 'JTabsList';

export const JTabsTriggerImpl: React.FC<InterJTabsTrigger> = ({
  invalid, invalidLabel, count, 'aria-describedby': describedBy, ...props
}) => {
  const baseId = useId();
  const invalidId = invalid ? `${baseId}-invalid` : undefined;
  const countId = count !== undefined ? `${baseId}-count` : undefined;
  const ids = [describedBy, invalidId, countId].filter(Boolean).join(' ');
  return (
    <JTabsTriggerView
      {...props}
      aria-describedby={ids || undefined}
      invalidId={invalidId}
      invalidLabel={invalidLabel ?? JTABS_TRIGGER_DEFAULTS.invalidLabel}
      countId={countId}
      count={count}
    />
  );
};
JTabsTriggerImpl.displayName = 'JTabsTrigger';

export const JTabsContentImpl: React.FC<React.HTMLAttributes<HTMLDivElement> & { value: string }> = (props) => (
  <JTabsContentView {...props} />
);
JTabsContentImpl.displayName = 'JTabsContent';
