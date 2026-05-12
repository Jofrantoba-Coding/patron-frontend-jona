import React from 'react';
import { cn } from '../../lib/cn';
import { InterNumberInputMolecule } from './InterNumberInputMolecule';
import { InputAtom } from '../../atoms/InputAtom';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

type NumberInputMoleculeViewProps = Omit<InterNumberInputMolecule, 'value' | 'defaultValue' | 'onValueChange' | 'onIncrement' | 'onDecrement' | 'onBlur'> & {
  displayValue: string;
  canDecrement: boolean;
  canIncrement: boolean;
  forwardedRef?: React.Ref<HTMLInputElement>;
  onInputChange: React.ChangeEventHandler<HTMLInputElement>;
  onInputBlur: React.FocusEventHandler<HTMLInputElement>;
  onDecrementClick: React.MouseEventHandler<HTMLButtonElement>;
  onIncrementClick: React.MouseEventHandler<HTMLButtonElement>;
};

const MinusIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M5 12h14" />
  </svg>
);

const PlusIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

export const NumberInputMoleculeView: React.FC<NumberInputMoleculeViewProps> = ({
  displayValue,
  canDecrement,
  canIncrement,
  hasError,
  disabled,
  className,
  forwardedRef,
  onInputChange,
  onInputBlur,
  onDecrementClick,
  onIncrementClick,
  ...props
}) => (
  <PanelAtom variant="ghost" padding="none" radius="none" className={cn('inline-flex max-w-full min-w-0 items-stretch rounded-md border bg-white', hasError ? 'border-danger-500' : 'border-neutral-300', className)}>
    <button
      type="button"
      aria-label="Decrement"
      disabled={disabled || !canDecrement}
      onClick={onDecrementClick}
      className="inline-flex min-h-9 w-9 shrink-0 items-center justify-center border-r border-neutral-200 text-neutral-600 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-40"
    >
      <MinusIcon />
    </button>
    <InputAtom
      {...props}
      ref={forwardedRef}
      type="number"
      value={displayValue}
      disabled={disabled}
      hasError={hasError}
      onChange={(_, event) => onInputChange(event)}
      onBlur={(_, event) => onInputBlur(event)}
      className="h-9 min-w-0 flex-1 rounded-none border-0 bg-neutral-50 px-3 py-1 text-center text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
    />
    <button
      type="button"
      aria-label="Increment"
      disabled={disabled || !canIncrement}
      onClick={onIncrementClick}
      className="inline-flex min-h-9 w-9 shrink-0 items-center justify-center border-l border-neutral-200 text-neutral-600 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-40"
    >
      <PlusIcon />
    </button>
  </PanelAtom>
);
