// UiShowcaseView.tsx — JONA View (render puro)
import React from 'react';
import { InterUiShowcase } from './InterUiShowcase';
import { ShowcaseSidebar } from '../../components/ShowcaseSidebar';
import { ComponentPreview } from '../../components/ComponentPreview';
import { LiveEditor } from '../../components/LiveEditor';
import { DocBlock } from '../../components/DocBlock';
import { ThemingGuide } from '../../components/ThemingGuide';
import { COMPONENT_REGISTRY } from '../../data/componentRegistry';
import { PREVIEW_MAP } from '../../components/previews';

const TABS = [
  { id: 'preview', label: '▶ Preview' },
  { id: 'code', label: '{ } Code' },
  { id: 'docs', label: '📖 Docs' },
] as const;

export const UiShowcaseView: React.FC<InterUiShowcase> = ({
  activeId,
  activeTab,
  code,
  isFullscreen,
  onSelectComponent,
  onTabChange,
  onCodeChange,
  onToggleFullscreen,
}) => {
  const entry = COMPONENT_REGISTRY.find((c) => c.id === activeId);
  const PreviewComponent = PREVIEW_MAP[activeId];

  // Fullscreen overlay — renders the component covering the entire viewport
  if (isFullscreen && PreviewComponent) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        {/* Minimal top bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900 text-white text-sm shrink-0">
          <span className="font-medium">{entry?.name ?? activeId}</span>
          <button
            onClick={onToggleFullscreen}
            className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700"
          >
            ✕ Exit fullscreen
          </button>
        </div>
        {/* Full-height preview */}
        <div className="flex-1 overflow-auto">
          <PreviewComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ShowcaseSidebar activeId={activeId} onSelect={onSelectComponent} />

      <main className="flex-1 overflow-y-auto">
        {!entry ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a component from the sidebar
          </div>
        ) : entry.id === 'theming' ? (
          <ThemingGuide />
        ) : (
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {entry.category}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{entry.name}</h1>
              <p className="text-gray-500 mt-1">{entry.description}</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 border-b">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'preview' && (
              <ComponentPreview onFullscreen={onToggleFullscreen}>
                {PreviewComponent ? <PreviewComponent /> : (
                  <p className="text-sm text-gray-400">No preview available</p>
                )}
              </ComponentPreview>
            )}

            {activeTab === 'code' && (
              <div className="flex flex-col gap-4">
                <LiveEditor code={code} onChange={onCodeChange} />
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-700">
                  ✏️ Edit the code above — changes are reflected in the editor. Copy and paste into your project to use.
                </div>
              </div>
            )}

            {activeTab === 'docs' && (
              <DocBlock
                usage={entry.usage}
                installCmd="npm install jona-ui"
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};
