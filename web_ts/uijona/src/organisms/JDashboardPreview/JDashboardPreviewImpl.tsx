// JDashboardPreviewImpl.tsx — JONA Implementation
import React from 'react';
import { InterJDashboardPreview, JDASHBOARD_PREVIEW_DEFAULTS } from './InterJDashboardPreview';
import { JDashboardPreviewView } from './JDashboardPreviewView';

export const JDashboardPreviewImpl: React.FC<InterJDashboardPreview> = (props) => (
  <JDashboardPreviewView {...JDASHBOARD_PREVIEW_DEFAULTS} {...props} />
);

JDashboardPreviewImpl.displayName = 'JDashboardPreview';
