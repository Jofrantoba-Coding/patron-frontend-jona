// ComponentPreviewView.tsx — JONA View (render puro)
import React from 'react';
import { InterComponentPreview } from './InterComponentPreview';

export const ComponentPreviewView: React.FC<InterComponentPreview> = ({ children }) => (
  <div className="border rounded-lg overflow-hidden bg-white">
    <div className="bg-gray-50 border-b px-3 py-1.5 text-xs text-gray-500 font-medium">
      Preview
    </div>
    <div className="p-6 min-h-40 flex items-start justify-start">
      {children}
    </div>
  </div>
);
