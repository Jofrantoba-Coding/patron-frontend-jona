// UiMenuShowcase.tsx — Level 3: Organism / JONA Layer: Template (visual)
// Sidebar navigation menu listing all showcase sections.
import React from 'react';
import { cn } from '../../lib/cn';
import { InterUiMenuShowcase } from './InterUiMenuShowcase';

export interface ShowcaseSection {
  id: string;
  label: string;
  group: string;
}

export const SHOWCASE_SECTIONS: ShowcaseSection[] = [
  // Atoms
  { id: 'buttons',    label: 'Button',      group: 'Atoms' },
  { id: 'badges',     label: 'Badge',       group: 'Atoms' },
  { id: 'avatars',    label: 'Avatar',      group: 'Atoms' },
  { id: 'spinner',    label: 'Spinner',     group: 'Atoms' },
  { id: 'progress',   label: 'Progress',    group: 'Atoms' },
  { id: 'skeleton',   label: 'Skeleton',    group: 'Atoms' },
  // Molecules
  { id: 'alerts',     label: 'Alert',       group: 'Molecules' },
  { id: 'formfields', label: 'Form Fields', group: 'Molecules' },
  { id: 'dialog',     label: 'Dialog',      group: 'Molecules' },
  { id: 'table',      label: 'Table',       group: 'Molecules' },
  { id: 'tabs',       label: 'Tabs',        group: 'Molecules' },
  { id: 'dropdown',   label: 'Dropdown',    group: 'Molecules' },
  { id: 'tooltip',    label: 'Tooltip',     group: 'Molecules' },
  { id: 'switch',     label: 'Switch',      group: 'Molecules' },
  { id: 'breadcrumb', label: 'Breadcrumb',  group: 'Molecules' },
  { id: 'pagination', label: 'Pagination',  group: 'Molecules' },
  { id: 'toast',      label: 'Toast',       group: 'Molecules' },
];

// Group sections by their group label
const grouped = SHOWCASE_SECTIONS.reduce<Record<string, ShowcaseSection[]>>((acc, s) => {
  (acc[s.group] ??= []).push(s);
  return acc;
}, {});

interface UiMenuShowcaseProps extends InterUiMenuShowcase {}

export const UiMenuShowcase: React.FC<UiMenuShowcaseProps> = ({
  activeSection,
  onSectionChange,
}) => {
  return (
    <nav aria-label="Component sections" className="flex flex-col gap-4 py-2">
      {Object.entries(grouped).map(([group, sections]) => (
        <div key={group}>
          {/* Group label */}
          <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            {group}
          </p>
          <ul className="space-y-0.5">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => onSectionChange(section.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'w-full text-left px-3 py-1.5 rounded-token-sm text-sm transition-colors duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                      isActive
                        ? 'bg-primary-600 text-white font-medium'
                        : 'text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                    )}
                  >
                    {section.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};
