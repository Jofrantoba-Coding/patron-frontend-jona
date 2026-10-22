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
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  /** Per level: the parent last requested and a token; only the response of the latest token is applied. */
  const latest = useRef<Record<string, { parent: string; token: number }>>({});
  const loader = useRef(loadChildren);
  loader.current = loadChildren;
  const parentOf = (index: number) => (index === 0 ? '' : values[levels[index - 1].name] ?? '');
  const parents = levels.map((_, index) => parentOf(index)).join('|');

  /** Starts a new request for the level; only the outcome of its latest token is applied. */
  const load = (name: string, parent: string, skip: boolean) => {
    const token = (latest.current[name]?.token ?? 0) + 1;
    latest.current[name] = { parent, token };
    setFailed((current) => ({ ...current, [name]: false }));
    const apply = (items: CascadeOption[], loadFailed: boolean) => {
      if (latest.current[name].token !== token) return;
      setOptions((current) => ({ ...current, [name]: items }));
      setFailed((current) => ({ ...current, [name]: loadFailed }));
    };
    if (skip) apply([], false);
    else loader.current(parent).then((items) => apply(items, false), () => apply([], true));
  };

  useEffect(() => {
    levels.forEach((level, index) => {
      const parent = parentOf(index);
      if (latest.current[level.name]?.parent !== parent) load(level.name, parent, index > 0 && parent === '');
    });
    // `parents` captures every parent id; `levels` is static per field.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parents]);

  return {
    levels: levels.map((level, index) => ({
      ...level,
      value: values[level.name] ?? '',
      options: options[level.name] ?? [],
      disabled: Boolean(readOnly) || Boolean(failed[level.name]) || (index > 0 && parentOf(index) === ''),
      loadFailed: Boolean(failed[level.name]),
      error: errors[level.name],
    })),
    onChange: (name, value) => {
      const at = levels.findIndex((level) => level.name === name);
      onChange(name, value);
      levels.slice(at + 1).forEach((below) => onChange(below.name, ''));
    },
    onRetry: (name) => load(name, latest.current[name]?.parent ?? '', false),
    registerField,
  };
}
