// JAccordionImpl.tsx — JONA Implementation
import React, { useState } from 'react';
import { JACCORDION_DEFAULTS, InterJAccordion, JAccordionItem } from './InterJAccordion';
import { JAccordionView } from './JAccordionView';

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export const JAccordionImpl: React.FC<InterJAccordion> = (props) => {
  const resolved = { ...JACCORDION_DEFAULTS, ...props };
  const [internalValue, setInternalValue] = useState<string[]>(toArray(resolved.defaultValue));

  const openValues = resolved.value !== undefined ? toArray(resolved.value) : internalValue;

  const emitChange = (values: string[]) => {
    const nextValue = resolved.multiple ? values : values[0] ?? '';
    resolved.onValueChange?.(nextValue);
  };

  const handleItemToggle = (item: JAccordionItem) => {
    if (item.disabled) return;
    const isOpen = openValues.includes(item.value);
    const nextValues = resolved.multiple
      ? isOpen
        ? openValues.filter((v) => v !== item.value)
        : [...openValues, item.value]
      : isOpen
        ? []
        : [item.value];

    if (resolved.value === undefined) setInternalValue(nextValues);
    emitChange(nextValues);
  };

  return (
    <JAccordionView
      {...resolved}
      openValues={openValues}
      onItemToggle={handleItemToggle}
    />
  );
};

JAccordionImpl.displayName = 'JAccordion';
