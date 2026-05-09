// AccordionMoleculeImpl.tsx — JONA Implementation
import React, { useState } from 'react';
import {
  ACCORDION_MOLECULE_DEFAULTS,
  AccordionItem,
  InterAccordionMolecule,
} from './InterAccordionMolecule';
import { AccordionMoleculeView } from './AccordionMoleculeView';

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export const AccordionMoleculeImpl: React.FC<InterAccordionMolecule> = (props) => {
  const resolved = { ...ACCORDION_MOLECULE_DEFAULTS, ...props };
  const [internalValue, setInternalValue] = useState<string[]>(toArray(resolved.defaultValue));
  const openValues = resolved.value !== undefined ? toArray(resolved.value) : internalValue;

  const emitChange = (values: string[]) => {
    const nextValue = resolved.multiple ? values : values[0] ?? '';
    resolved.onValueChange?.(nextValue);
  };

  const handleItemToggle = (item: AccordionItem) => {
    if (item.disabled) return;
    const isOpen = openValues.includes(item.value);
    const nextValues = resolved.multiple
      ? isOpen
        ? openValues.filter((value) => value !== item.value)
        : [...openValues, item.value]
      : isOpen
        ? []
        : [item.value];

    if (resolved.value === undefined) setInternalValue(nextValues);
    emitChange(nextValues);
  };

  return <AccordionMoleculeView {...resolved} openValues={openValues} onItemToggle={handleItemToggle} />;
};

AccordionMoleculeImpl.displayName = 'AccordionMolecule';
