// ComponentPreviewImpl.tsx — JONA Impl
import React from 'react';
import { ComponentPreviewView } from './ComponentPreviewView';
import { InterComponentPreview } from './InterComponentPreview';

export const ComponentPreviewImpl: React.FC<InterComponentPreview> = (props) => (
  <ComponentPreviewView {...props} />
);
