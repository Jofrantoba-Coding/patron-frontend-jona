// SelectFieldMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { LabelAtom } from '../../atoms/LabelAtom';
import { SelectAtom } from '../../atoms/SelectAtom';
import { ErrorMessageAtom } from '../../atoms/ErrorMessageAtom';
import { InterSelectFieldMolecule } from './InterSelectFieldMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

type SelectFieldMoleculeViewProps = InterSelectFieldMolecule & {
  forwardedRef?: React.Ref<HTMLSelectElement>;
  value?: string;
};

export const SelectFieldMoleculeView: React.FC<SelectFieldMoleculeViewProps> = ({
  id, label, options, groups, placeholder, errorMessage, description, required, className,
  onChange, onBlur, onFocus, forwardedRef, ...rest
}) => {
  const hasError = !!errorMessage;
  return (
    <PanelAtom variant="ghost" padding="none" radius="none" className={cn('flex flex-col gap-1.5', className)}>
      <LabelAtom htmlFor={id} required={required}>{label}</LabelAtom>
      <SelectAtom
        ref={forwardedRef}
        id={id}
        options={options}
        groups={groups}
        placeholder={placeholder}
        hasError={hasError}
        required={required}
        aria-describedby={description ? `${id}-desc` : undefined}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        {...rest}
      />
      {description && !hasError && <ErrorMessageAtom id={`${id}-desc`} message={description} type="description" />}
      {hasError && <ErrorMessageAtom message={errorMessage} type="error" />}
    </PanelAtom>
  );
};
