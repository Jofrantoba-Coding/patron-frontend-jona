// TextareaAtomView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterTextareaAtom } from './InterTextareaAtom';

interface TextareaAtomViewProps extends Omit<InterTextareaAtom, 'onChange' | 'onBlur'> {
  forwardedRef?: React.Ref<HTMLTextAreaElement>;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  [key: string]: unknown;
}

export const TextareaAtomView: React.FC<TextareaAtomViewProps> = ({
  hasError, autoResize: _autoResize, className, onChange, onFocus, onBlur, onKeyDown, forwardedRef, ...rest
}) => (
  <textarea
    ref={forwardedRef}
    onChange={onChange}
    onFocus={onFocus}
    onBlur={onBlur}
    onKeyDown={onKeyDown}
    className={cn(
      'flex min-h-[80px] w-full rounded-md border bg-white px-3 py-2 text-sm text-neutral-900',
      'placeholder:text-neutral-400 transition-colors duration-150 resize-y',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary-500',
      'disabled:cursor-not-allowed disabled:opacity-50',
      hasError ? 'border-danger-500 focus-visible:ring-danger-500' : 'border-neutral-300',
      className
    )}
    {...rest}
  />
);
