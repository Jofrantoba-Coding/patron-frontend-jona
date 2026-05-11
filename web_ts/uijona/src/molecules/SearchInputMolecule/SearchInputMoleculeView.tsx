import React from 'react';
import { cn } from '../../lib/cn';
import { SpinnerAtom } from '../../atoms/SpinnerAtom';
import { InterSearchInputMolecule } from './InterSearchInputMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

type SearchInputMoleculeViewProps = Omit<InterSearchInputMolecule, 'onChange' | 'onSearch' | 'onClear' | 'onBlur' | 'onEnterPress'> & {
  inputValue: string;
  forwardedRef?: React.Ref<HTMLInputElement>;
  onInputChange: React.ChangeEventHandler<HTMLInputElement>;
  onInputBlur: React.FocusEventHandler<HTMLInputElement>;
  onInputKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
  onClearClick: React.MouseEventHandler<HTMLButtonElement>;
  onSearchClick: React.MouseEventHandler<HTMLButtonElement>;
};

const SearchIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const XIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const SearchInputMoleculeView: React.FC<SearchInputMoleculeViewProps> = ({
  inputValue,
  clearable,
  loading,
  disabled,
  className,
  containerClassName,
  forwardedRef,
  onInputChange,
  onInputBlur,
  onInputKeyDown,
  onClearClick,
  onSearchClick,
  placeholder = 'Search',
  'aria-label': ariaLabel = 'Search',
  ...props
}) => (
  <PanelAtom variant="ghost" padding="none" radius="none" className={cn('flex w-full min-w-0 items-center gap-2', containerClassName)}>
    <PanelAtom variant="ghost" padding="none" radius="none" className="relative min-w-0 flex-1">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
        {loading ? <SpinnerAtom size="sm" /> : <SearchIcon />}
      </span>
      <input
        {...props}
        ref={forwardedRef}
        type="search"
        role="searchbox"
        value={inputValue}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={onInputChange}
        onBlur={onInputBlur}
        onKeyDown={onInputKeyDown}
        className={cn(
          'flex h-9 w-full min-w-0 rounded-md border border-neutral-300 bg-neutral-50 py-1 pl-9 pr-9 text-sm text-neutral-900',
          'placeholder:text-neutral-400 transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
      />
      {clearable && inputValue && !disabled && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={onClearClick}
          className="absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <XIcon />
        </button>
      )}
    </PanelAtom>
    <button
      type="button"
      disabled={disabled}
      onClick={onSearchClick}
      className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-md bg-primary-600 px-3 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50"
    >
      Search
    </button>
  </PanelAtom>
);
