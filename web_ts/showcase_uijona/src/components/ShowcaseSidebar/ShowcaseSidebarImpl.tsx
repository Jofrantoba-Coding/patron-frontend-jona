// ShowcaseSidebarImpl.tsx — JONA Impl (no state needed, pure pass-through)
import React from 'react';
import { ShowcaseSidebarView } from './ShowcaseSidebarView';
import { InterShowcaseSidebar } from './InterShowcaseSidebar';

export const ShowcaseSidebarImpl: React.FC<InterShowcaseSidebar> = (props) => (
  <ShowcaseSidebarView {...props} />
);
