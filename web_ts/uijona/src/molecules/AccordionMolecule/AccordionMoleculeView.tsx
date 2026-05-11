// AccordionMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { AccordionItem, InterAccordionMolecule } from './InterAccordionMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

interface AccordionMoleculeViewProps extends InterAccordionMolecule {
  openValues: string[];
  onItemToggle: (item: AccordionItem) => void;
}

export const AccordionMoleculeView: React.FC<AccordionMoleculeViewProps> = ({
  items, openValues, className, onItemToggle,
}) => (
  <PanelAtom variant="ghost" padding="none" radius="none" className={cn('w-full divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-white', className)}>
    {items.map((item) => {
      const open = openValues.includes(item.value);
      const buttonId = `accordion-trigger-${item.value}`;
      const panelId = `accordion-panel-${item.value}`;
      return (
        <PanelAtom variant="ghost" padding="none" radius="none" key={item.value}>
          <h3>
            <button
              id={buttonId}
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              disabled={item.disabled}
              onClick={() => onItemToggle(item)}
              className={cn(
                'flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-neutral-900',
                'transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
            >
              <span>{item.title}</span>
              <span aria-hidden="true" className={cn('text-neutral-500 transition-transform', open && 'rotate-180')}>
                ▾
              </span>
            </button>
          </h3>
          {open && (
            <PanelAtom variant="ghost" padding="none" radius="none"
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="px-4 pb-4 text-sm text-neutral-600"
            >
              {item.content}
            </PanelAtom>
          )}
        </PanelAtom>
      );
    })}
  </PanelAtom>
);
