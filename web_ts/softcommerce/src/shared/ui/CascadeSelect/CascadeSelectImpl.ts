// Layer: Impl. A chain of dependent selects (src/shared/dependentChain.ts): each level loads from the one above.
import { useEffect, useReducer, useRef } from 'react';
import { createDependentChain, fieldsToClear, type ChainNode, type DependentChain } from '../../dependentChain';
import type { CascadeLevel, CascadeOption, InterCascadeSelect } from './InterCascadeSelect';

export interface CascadeSelectProps {
  /** From the top level (no parent) to the leaf. */
  levels: CascadeLevel[];
  /** Selected id per level name; '' or missing means unset. */
  values: Record<string, string>;
  /** Children of a parent id; '' asks for the top level. The static `filter`, when given, is the second argument. */
  loadChildren: (parent: string, filter?: Record<string, string>) => Promise<CascadeOption[]>;
  /** Static filter sent with every level request (for example `{ has: 'zonas' }`). */
  filter?: Record<string, string>;
  readOnly?: boolean;
  errors?: Record<string, string>;
  onChange: (name: string, value: string) => void;
  registerField?: InterCascadeSelect['registerField'];
}

export function useCascadeSelectImpl({ levels, values, loadChildren, filter, readOnly, errors = {}, onChange, registerField }: CascadeSelectProps): InterCascadeSelect {
  const [, refresh] = useReducer((n: number) => n + 1, 0);
  const loader = useRef({ loadChildren, filter });
  loader.current = { loadChildren, filter };
  /** Each level is a node whose only parent is the level above, sent as `parent`. */
  const nodes = useRef<ChainNode[]>();
  nodes.current ??= levels.map((level, index) => ({ name: level.name, parents: index === 0 ? [] : [{ field: levels[index - 1].name, filterKey: 'parent' }] }));
  const chain = useRef<DependentChain>();
  chain.current ??= createDependentChain(
    nodes.current,
    (_name, filters) => (loader.current.filter ? loader.current.loadChildren(filters.parent ?? '', loader.current.filter) : loader.current.loadChildren(filters.parent ?? '')),
    refresh,
  );
  const parents = levels.map((_, index) => (index === 0 ? '' : values[levels[index - 1].name] ?? '')).join('|');

  useEffect(() => {
    chain.current!.sync(values);
    // `parents` captures every parent id; `levels` is static per field.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parents]);

  return {
    levels: levels.map((level) => {
      const failed = chain.current!.failed(level.name);
      return {
        ...level,
        value: values[level.name] ?? '',
        options: chain.current!.options(level.name),
        disabled: Boolean(readOnly) || failed || chain.current!.blocked(level.name, values),
        loadFailed: failed,
        error: errors[level.name],
      };
    }),
    onChange: (name, value) => {
      onChange(name, value);
      fieldsToClear(nodes.current!, name).forEach((below) => onChange(below, ''));
    },
    onRetry: (name) => chain.current!.retry(name, values),
    registerField,
  };
}
