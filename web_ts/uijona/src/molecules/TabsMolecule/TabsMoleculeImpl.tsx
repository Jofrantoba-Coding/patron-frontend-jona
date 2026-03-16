// TabsMoleculeImpl.tsx — JONA Implementation
import React from 'react';
import { InterTabsMolecule, TABS_MOLECULE_DEFAULTS } from './InterTabsMolecule';
import { TabsMoleculeView, TabsListView, TabsTriggerView, TabsContentView } from './TabsMoleculeView';

export const TabsMoleculeImpl: React.FC<InterTabsMolecule> = (props) => (
  <TabsMoleculeView {...TABS_MOLECULE_DEFAULTS} {...props} />
);
TabsMoleculeImpl.displayName = 'TabsMolecule';

export const TabsListImpl: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => <TabsListView {...props} />;
export const TabsTriggerImpl: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }> = (props) => <TabsTriggerView {...props} />;
export const TabsContentImpl: React.FC<React.HTMLAttributes<HTMLDivElement> & { value: string }> = (props) => <TabsContentView {...props} />;
