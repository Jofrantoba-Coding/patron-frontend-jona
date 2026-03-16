// DocBlockView.tsx — JONA View (render puro)
import React from 'react';
import { InterDocBlock } from './InterDocBlock';

export const DocBlockView: React.FC<InterDocBlock> = ({ usage, installCmd }) => (
  <div className="flex flex-col gap-4">
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Installation</h3>
      <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-green-400">
        {installCmd}
      </div>
    </div>
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Usage</h3>
      <pre className="bg-gray-900 rounded-lg p-4 text-sm text-gray-100 overflow-x-auto whitespace-pre-wrap">
        {usage}
      </pre>
    </div>
  </div>
);
