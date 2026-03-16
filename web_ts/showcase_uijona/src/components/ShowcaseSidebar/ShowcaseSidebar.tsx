// ShowcaseSidebar.tsx — JONA entry component
import React from 'react';
import { ShowcaseSidebarImpl } from './ShowcaseSidebarImpl';
import { InterShowcaseSidebar } from './InterShowcaseSidebar';

export const ShowcaseSidebar: React.FC<InterShowcaseSidebar> = (props) => (
  <ShowcaseSidebarImpl {...props} />
);
