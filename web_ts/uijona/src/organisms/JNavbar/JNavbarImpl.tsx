// JNavbarImpl.tsx — JONA Implementation
import React from 'react';
import { InterJNavbar } from './InterJNavbar';
import { JNavbarView } from './JNavbarView';

export const JNavbarImpl: React.FC<InterJNavbar> = (props) => <JNavbarView {...props} />;

JNavbarImpl.displayName = 'JNavbar';
