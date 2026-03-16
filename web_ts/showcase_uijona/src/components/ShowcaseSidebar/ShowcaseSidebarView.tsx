import React from 'react';
import { InterShowcaseSidebar } from './InterShowcaseSidebar';
import { COMPONENT_REGISTRY, CATEGORIES } from '../../data/componentRegistry';

export const ShowcaseSidebarView: React.FC<InterShowcaseSidebar> = ({ activeId, onSelect }) => (
  <aside className="w-64 min-h-screen bg-white border-r flex flex-col">
    {/* Logo */}
    <div className="px-4 py-4 border-b">
      <span className="font-bold text-lg text-blue-600">JONA UI</span>
      <p className="text-xs text-gray-400 mt-0.5">Component Showcase</p>
    </div>

    {/* Nav */}
    <nav className="flex-1 overflow-y-auto py-3">
      {CATEGORIES.map((cat) => {
        const items = COMPONENT_REGISTRY.filter((c) => c.category === cat);
        if (!items.length) return null;
        return (
          <div key={cat} className="mb-4">
            <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {cat}
            </p>
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  activeId === item.id
                    ? 'bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        );
      })}
    </nav>

    {/* Footer */}
    <div className="px-4 py-3 border-t text-xs text-gray-400">
      v1.1.1 · jona-ui
    </div>
  </aside>
);
