// SelectFieldMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { JLabel } from '../../atoms/JLabel';
import { JComboBox } from '../../atoms/JComboBox';
import { InterSelectFieldMolecule } from './InterSelectFieldMolecule';
import { JPanel } from '../../atoms/JPanel/JPanel';

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
    <JPanel variant="ghost" padding="none" radius="none" className={cn('flex flex-col gap-1.5', className)}>
      <JLabel variant="label" htmlFor={id} required={required}>{label}</JLabel>
      <JComboBox
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
      {description && !hasError && <JLabel id={`${id}-desc`} message={description} variant="description" />}
      {hasError && <JLabel message={errorMessage} variant="error" />}
    </JPanel>
  );
};
