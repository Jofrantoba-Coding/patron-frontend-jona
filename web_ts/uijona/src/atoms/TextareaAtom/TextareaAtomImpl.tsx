// TextareaAtomImpl.tsx — JONA Implementation
import React, { useRef } from 'react';
import { InterTextareaAtom, TEXTAREA_ATOM_DEFAULTS } from './InterTextareaAtom';
import { TextareaAtomView } from './TextareaAtomView';

type TextareaAtomImplProps = InterTextareaAtom &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'onBlur' | 'onKeyDown'>;

function assignRef<T>(ref: React.ForwardedRef<T>, value: T): void {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

export const TextareaAtomImpl = React.forwardRef<HTMLTextAreaElement, TextareaAtomImplProps>(
  ({ onChange, onBlur, onKeyDown, autoResize, ...props }, ref) => {
    const resolved = { ...TEXTAREA_ATOM_DEFAULTS, autoResize, ...props };
    const localRef = useRef<HTMLTextAreaElement | null>(null);

    const updateHeight = (target: HTMLTextAreaElement) => {
      if (!resolved.autoResize) return;
      target.style.height = 'auto';
      target.style.height = `${target.scrollHeight}px`;
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateHeight(event.target);
      onChange?.(event.target.value, event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      onBlur?.(event.target.value, event);
    };

    return (
      <TextareaAtomView
        {...resolved}
        forwardedRef={(node) => {
          localRef.current = node;
          if (node) updateHeight(node);
          assignRef(ref, node);
        }}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
      />
    );
  }
);

TextareaAtomImpl.displayName = 'TextareaAtom';
