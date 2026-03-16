// ComponentPreview.tsx — JONA entry component
import React from 'react';
import { ComponentPreviewImpl } from './ComponentPreviewImpl';
import { InterComponentPreview } from './InterComponentPreview';

export const ComponentPreview: React.FC<InterComponentPreview> = (props) => (
  <ComponentPreviewImpl {...props} />
);
