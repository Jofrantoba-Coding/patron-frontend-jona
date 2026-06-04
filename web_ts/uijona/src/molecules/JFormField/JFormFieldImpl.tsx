// JFormFieldImpl.tsx — JONA Implementation
import React from 'react';
import { InterJFormField, JFORMFIELD_DEFAULTS } from './InterJFormField';
import { JFormFieldView, JFormFieldViewProps } from './JFormFieldView';

type JFormFieldImplProps = Omit<InterJFormField, 'onInvalid'> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'onKeyDown' | 'onInvalid'> & {
    onInvalid?: (value: string, message: string) => void;
  };

export const JFormFieldImpl = React.forwardRef<HTMLInputElement, JFormFieldImplProps>(
  ({ onBlur, onInvalid, onValid, errorMessage, ...props }, ref) => {
    const resolved = { ...JFORMFIELD_DEFAULTS, ...props };
    const hasError = !!errorMessage;

    const handleBlur = (value: string, e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(value, e);
      if (hasError) onInvalid?.(value, errorMessage ?? '');
      else onValid?.(value);
    };

    return (
      <JFormFieldView
        {...resolved as JFormFieldViewProps}
        errorMessage={errorMessage}
        onBlur={handleBlur}
        onValid={onValid}
        forwardedRef={ref}
      />
    );
  },
);

JFormFieldImpl.displayName = 'JFormField';
