// Layer: Impl. Loads each level's options from the level above and guards against stale responses.
import { useEffect, useRef, useState } from 'react';
import type { CascadeLevel, CascadeOption, InterCascadeSelect } from './InterCascadeSelect';

export interface CascadeSelectProps {
  /** From the top level (no parent) to the leaf. */
  levels: CascadeLevel[];
  /** Selected id per level name; '' or missing means unset. */
  values: Record<string, string>;
  /** Children of a parent id; '' asks for the top level. */
  loadChildren: (parent: string) => Promise<CascadeOption[]>;
  readOnly?: boolean;
  errors?: Record<string, string>;
  onChange: (name: string, value: string) => void;
  registerField?: InterCascadeSelect['registerField'];
}

export function useCascadeSelectImpl({ levels, values, loadChildren, readOnly, errors = {}, onChange, registerField }: CascadeSelectProps): InterCascadeSelect {
  const [options, setOptions] = useState<Record<string, CascadeOption[]>>({});
  /** Per level: the parent last requested and a token; only the response of the latest token is applied. */
  const latest = useRef<Record<string, { parent: string; token: number }>>({});
  const loader = useRef(loadChildren);
  loader.current = loadChildren;
  const parentOf = (index: number) => (index === 0 ? '' : values[levels[index - 1].name] ?? '');
  const parents = levels.map((_, index) => parentOf(index)).join('|');

  useEffect(() => {
    levels.forEach((level, index) => {
      const parent = parentOf(index);
      const previous = latest.current[level.name];
      if (previous?.parent === parent) return;
      const token = (previous?.token ?? 0) + 1;
      latest.current[level.name] = { parent, token };
      const apply = (items: CascadeOption[]) => {
        if (latest.current[level.name].token === token) setOptions((current) => ({ ...current, [level.name]: items }));
      };
      if (index > 0 && parent === '') apply([]);
      else loader.current(parent).then(apply, () => apply([]));
    });
    // `parents` captures every parent id; `levels` is static per field.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parents]);

  return {
    levels: levels.map((level, index) => ({
      ...level,
      value: values[level.name] ?? '',
      options: options[level.name] ?? [],
      disabled: Boolean(readOnly) || (index > 0 && parentOf(index) === ''),
      error: errors[level.name],
    })),
    onChange: (name, value) => {
      const at = levels.findIndex((level) => level.name === name);
      onChange(name, value);
      levels.slice(at + 1).forEach((below) => onChange(below.name, ''));
    },
    registerField,
  };
}
