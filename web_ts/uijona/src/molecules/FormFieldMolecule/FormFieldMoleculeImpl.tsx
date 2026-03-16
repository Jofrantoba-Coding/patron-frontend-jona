// FormFieldMoleculeImpl.tsx — JONA Implementation
import React from 'react';
import { InterFormFieldMolecule, FORM_FIELD_MOLECULE_DEFAULTS } from './InterFormFieldMolecule';
import { FormFieldMoleculeView } from './FormFieldMoleculeView';

type FormFieldMoleculeImplProps = Omit<InterFormFieldMolecule, 'onInvalid'> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'onKeyDown' | 'onInvalid'> & {
    onInvalid?: (value: string, message: string) => void;
  };

export const FormFieldMoleculeImpl = React.forwardRef<HTMLInputElement, FormFieldMoleculeImplProps>(
  ({ onBlur, onInvalid, onValid, errorMessage, ...props }, ref) => {
    const resolved = { ...FORM_FIELD_MOLECULE_DEFAULTS, ...props };
    const hasError = !!errorMessage;

    const handleBlur = (value: string, e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(value, e);
      if (hasError) onInvalid?.(value, errorMessage ?? '');
      else onValid?.(value);
    };

    return (
      <FormFieldMoleculeView
        {...resolved}
        errorMessage={errorMessage}
        onBlur={handleBlur}
        onValid={onValid}
        forwardedRef={ref}
      />
    );
  }
);

FormFieldMoleculeImpl.displayName = 'FormFieldMolecule';
