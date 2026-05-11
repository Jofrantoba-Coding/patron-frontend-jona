// MultiSelectMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { MultiSelectOption } from './InterMultiSelectMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

interface MultiSelectMoleculeViewProps {
  selected: MultiSelectOption[];
  filtered: MultiSelectOption[];
  query: string;
  open: boolean;
  disabled: boolean;
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  maxSelected?: number;
  className?: string;
  listStyle: React.CSSProperties;
  triggerRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  listRef: React.RefObject<HTMLDivElement>;
  onTriggerClick: () => void;
  onQueryChange: (q: string) => void;
  onToggle: (opt: MultiSelectOption) => void;
  onRemove: (value: string) => void;
  onInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const MultiSelectMoleculeView: React.FC<MultiSelectMoleculeViewProps> = ({
  selected, filtered, query, open, disabled, placeholder, searchPlaceholder, emptyText,
  maxSelected, className, listStyle, triggerRef, inputRef, listRef,
  onTriggerClick, onQueryChange, onToggle, onRemove, onInputKeyDown,
}) => {
  const atMax = maxSelected !== undefined && selected.length >= maxSelected;
  return (
    <PanelAtom variant="ghost" padding="none" radius="none" className={cn('relative w-full', className)}>
      {/* Trigger box */}
      <PanelAtom variant="ghost" padding="none" radius="none"
        ref={triggerRef}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-disabled={disabled}
        onClick={disabled ? undefined : onTriggerClick}
        className={cn(
          'flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-neutral-300 bg-neutral-50 px-2 py-1 text-sm transition-colors',
          open && 'ring-2 ring-primary-500',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        )}
      >
        {selected.map((opt) => (
          <span key={opt.value} className="inline-flex items-center gap-1 rounded bg-primary-100 px-1.5 py-0.5 text-xs font-medium text-primary-700">
            {opt.label}
            <button
              type="button"
              aria-label={`Quitar ${opt.label}`}
              onClick={(e) => { e.stopPropagation(); onRemove(opt.value); }}
              className="ml-0.5 rounded hover:text-primary-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </span>
        ))}
        {selected.length === 0 && (
          <span className="text-neutral-400">{placeholder}</span>
        )}
        <svg className="ml-auto h-4 w-4 shrink-0 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"
          style={{ transform: open ? 'rotate(180deg)' : undefined }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </PanelAtom>

      {/* Dropdown */}
      {open && createPortal(
        <PanelAtom variant="ghost" padding="none" radius="none" ref={listRef} style={listStyle} className="z-50 flex max-h-64 max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg">
          <PanelAtom variant="ghost" padding="none" radius="none" className="border-b border-neutral-100 p-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="h-8 w-full rounded border border-neutral-200 bg-white px-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </PanelAtom>
          {atMax && (
            <p className="px-3 py-1.5 text-xs text-neutral-400">Máximo {maxSelected} seleccionados</p>
          )}
          <PanelAtom variant="ghost" padding="none" radius="none" role="listbox" aria-multiselectable="true" className="overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-neutral-400">{emptyText}</p>
            ) : (
              filtered.map((opt) => {
                const isSelected = selected.some((s) => s.value === opt.value);
                const isDisabled = opt.disabled || (atMax && !isSelected);
                return (
                  <button
                    key={opt.value}
                    role="option"
                    type="button"
                    aria-selected={isSelected}
                    aria-disabled={isDisabled}
                    disabled={isDisabled}
                    onClick={() => onToggle(opt)}
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors',
                      isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-neutral-50',
                      isSelected && 'font-medium text-primary-600'
                    )}
                  >
                    <span className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                      isSelected ? 'border-primary-600 bg-primary-600' : 'border-neutral-300 bg-white'
                    )}>
                      {isSelected && (
                        <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                  </button>
                );
              })
            )}
          </PanelAtom>
        </PanelAtom>,
        document.body
      )}
    </PanelAtom>
  );
};
