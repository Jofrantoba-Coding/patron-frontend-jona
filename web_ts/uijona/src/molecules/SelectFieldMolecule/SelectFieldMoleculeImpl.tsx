// SelectFieldMoleculeImpl.tsx — JONA Implementation
import React from 'react';
import { InterSelectFieldMolecule } from './InterSelectFieldMolecule';
import { SelectFieldMoleculeView } from './SelectFieldMoleculeView';

type SelectFieldMoleculeImplProps = InterSelectFieldMolecule &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'onBlur' | 'value'> & {
    value?: string;
  };

export const SelectFieldMoleculeImpl = React.forwardRef<HTMLSelectElement, SelectFieldMoleculeImplProps>(
  (props, ref) => <SelectFieldMoleculeView {...props} forwardedRef={ref} />
);

SelectFieldMoleculeImpl.displayName = 'SelectFieldMolecule';
