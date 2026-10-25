import React from 'react';
import { cn } from '../../lib/cn';
import { JTextBox } from '../../atoms/JTextBox';
import { JSpinner } from '../../atoms/JSpinner';
import { InterJSearchInput } from './InterJSearchInput';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { CONTROL_BORDER, FG, FG_MUTED, HOVER_FG, HOVER_OVERLAY, ON_PRIMARY, PLACEHOLDER, SURFACE_MUTED } from '../../theme/tokenClasses';

type JSearchInputViewProps = Omit<InterJSearchInput, 'onChange' | 'onSearch' | 'onClear' | 'onBlur' | 'onEnterPress'> & {
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

export const JSearchInputView: React.FC<JSearchInputViewProps> = ({
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
  <JPanel variant="ghost" padding="none" radius="none" className={cn('flex flex-row w-full min-w-0 items-center gap-2', containerClassName)}>
    <JPanel variant="ghost" padding="none" radius="none" className="relative min-w-0 flex-1">
      <span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${FG_MUTED}`}>
        {loading ? <JSpinner size="sm" /> : <SearchIcon />}
      </span>
      <JTextBox
        {...props}
        ref={forwardedRef}
        type="search"
        role="searchbox"
        value={inputValue}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(_, event) => onInputChange(event)}
        onBlur={(_, event) => onInputBlur(event)}
        onKeyDown={onInputKeyDown}
        className={cn(
          `flex h-9 w-full min-w-0 rounded-md border ${CONTROL_BORDER} ${SURFACE_MUTED} py-1 pl-9 pr-12 text-sm sm:pr-9 ${FG}`,
          `${PLACEHOLDER} transition-colors duration-200`,
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
          className={`absolute right-0 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 sm:right-2 sm:h-6 sm:w-6 items-center justify-center rounded ${FG_MUTED} ${HOVER_OVERLAY} ${HOVER_FG} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
        >
          <XIcon />
        </button>
      )}
    </JPanel>
    <button
      type="button"
      disabled={disabled}
      onClick={onSearchClick}
      className={`inline-flex min-h-11 shrink-0 sm:min-h-9 items-center justify-center rounded-md bg-primary-600 px-3 text-sm font-medium ${ON_PRIMARY} transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50`}
    >
      Search
    </button>
  </JPanel>
);
