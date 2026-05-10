// ComboboxMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { ComboboxOption } from './InterComboboxMolecule';

interface ComboboxMoleculeViewProps {
  selected: ComboboxOption | null;
  query: string;
  filtered: ComboboxOption[];
  open: boolean;
  disabled: boolean;
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  className?: string;
  listStyle: React.CSSProperties;
  triggerRef: React.RefObject<HTMLButtonElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  listRef: React.RefObject<HTMLDivElement>;
  activeIndex: number;
  onTriggerClick: () => void;
  onQueryChange: (q: string) => void;
  onSelect: (opt: ComboboxOption) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const ComboboxMoleculeView: React.FC<ComboboxMoleculeViewProps> = ({
  selected, query, filtered, open, disabled, placeholder, searchPlaceholder, emptyText,
  className, listStyle, triggerRef, inputRef, listRef, activeIndex,
  onTriggerClick, onQueryChange, onSelect, onKeyDown,
}) => (
  <div className={cn('relative inline-block w-full', className)}>
    {/* Trigger */}
    <button
      ref={triggerRef}
      type="button"
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-autocomplete="list"
      disabled={disabled}
      onClick={onTriggerClick}
      onKeyDown={onKeyDown}
      className={cn(
        'flex h-9 w-full items-center justify-between rounded-md border border-neutral-300 bg-neutral-50 px-3 py-1 text-sm transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-0',
        'disabled:cursor-not-allowed disabled:opacity-50',
        open && 'ring-2 ring-primary-500 ring-offset-0'
      )}
    >
      <span className={cn('min-w-0 flex-1 truncate text-left', !selected && 'text-neutral-400')}>
        {selected ? selected.label : placeholder}
      </span>
      <svg className="ml-2 h-4 w-4 shrink-0 text-neutral-400 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"
        style={{ transform: open ? 'rotate(180deg)' : undefined }}>
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    {/* Dropdown panel */}
    {open && createPortal(
      <div ref={listRef} style={listStyle} className="z-50 flex max-h-64 max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg">
        {/* Search */}
        <div className="border-b border-neutral-100 p-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="h-8 w-full rounded border border-neutral-200 bg-white px-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        {/* Options */}
        <div role="listbox" className="overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-neutral-400">{emptyText}</p>
          ) : (
            filtered.map((opt, i) => (
              <button
                key={opt.value}
                role="option"
                type="button"
                aria-selected={selected?.value === opt.value}
                aria-disabled={opt.disabled}
                disabled={opt.disabled}
                onClick={() => onSelect(opt)}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors',
                  'focus-visible:outline-none',
                  opt.disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
                  i === activeIndex && 'bg-neutral-100',
                  selected?.value === opt.value ? 'font-medium text-primary-600' : 'text-neutral-700',
                  !opt.disabled && i !== activeIndex && 'hover:bg-neutral-50'
                )}
              >
                <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                {selected?.value === opt.value && (
                  <svg className="h-4 w-4 shrink-0 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))
          )}
        </div>
      </div>,
      document.body
    )}
  </div>
);
