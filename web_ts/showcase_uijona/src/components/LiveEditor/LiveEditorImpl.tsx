import React from 'react';
import { LiveEditorView } from './LiveEditorView';

interface LiveEditorImplProps {
  code: string;
  onChange: (code: string) => void;
}

export const LiveEditorImpl: React.FC<LiveEditorImplProps> = ({ code, onChange }) => (
  <LiveEditorView code={code} onChange={onChange} />
);
