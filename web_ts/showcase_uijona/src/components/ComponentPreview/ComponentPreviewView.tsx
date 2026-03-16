// ComponentPreviewView.tsx — JONA View (render puro)
import React from 'react';
import { InterComponentPreview } from './InterComponentPreview';

export const ComponentPreviewView: React.FC<InterComponentPreview> = ({ children, onFullscreen }) => (
  <div className="border rounded-lg overflow-hidden bg-white">
    <div className="bg-gray-50 border-b px-3 py-1.5 flex items-center justify-between">
      <span className="text-xs text-gray-500 font-medium">Preview</span>
      {onFullscreen && (
        <button
          onClick={onFullscreen}
          title="Fullscreen preview"
          className="text-xs text-gray-400 hover:text-gray-700 transition-colors px-1.5 py-0.5 rounded hover:bg-gray-200"
        >
          ⛶ Fullscreen
        </button>
      )}
    </div>
    <div className="p-6 min-h-40 flex items-start justify-start">
      {children}
    </div>
  </div>
);
