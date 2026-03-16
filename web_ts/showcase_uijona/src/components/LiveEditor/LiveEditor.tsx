// LiveEditor.tsx — JONA entry component
import React from 'react';
import { LiveEditorImpl } from './LiveEditorImpl';
import { InterLiveEditor } from './InterLiveEditor';

export const LiveEditor: React.FC<InterLiveEditor> = (props) => (
  <LiveEditorImpl {...props} />
);
