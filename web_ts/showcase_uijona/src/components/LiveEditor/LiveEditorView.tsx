import React from 'react';
import Editor from '@monaco-editor/react';
import { InterLiveEditor } from './InterLiveEditor';

export const LiveEditorView: React.FC<InterLiveEditor> = ({ code, onChange }) => (
  <div className="border rounded-lg overflow-hidden h-80">
    <div className="bg-gray-800 text-gray-300 text-xs px-3 py-1.5 flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
      <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
      <span className="ml-2 font-mono">Live Editor</span>
    </div>
    <Editor
      height="calc(100% - 28px)"
      defaultLanguage="typescript"
      value={code}
      onChange={(v) => onChange(v ?? '')}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        tabSize: 2,
        automaticLayout: true,
      }}
    />
  </div>
);
