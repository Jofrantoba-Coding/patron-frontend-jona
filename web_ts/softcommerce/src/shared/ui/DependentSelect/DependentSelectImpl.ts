// Layer: Impl. One node of the dependent chain: loads from the parents' values and drops stale responses.
import { useEffect, useReducer, useRef } from 'react';
import { createDependentChain, type DependentChain } from '../../dependentChain';
import { DEPENDENTSELECT_DEFAULTS, type InterDependentSelect } from './InterDependentSelect';

export type DependentSelectViewProps = typeof DEPENDENTSELECT_DEFAULTS &
  Pick<InterDependentSelect, 'name' | 'label'> & {
    options: { id: string; name: string }[];
    value: string;
    disabled: boolean;
    loadFailed: boolean;
    onValueChange: (value: string) => void;
    onRetry: () => void;
  };

export function useDependentSelectImpl(props: InterDependentSelect): DependentSelectViewProps {
  const { name, label, parents, values, load, readOnly, hasError, onChange } = { ...DEPENDENTSELECT_DEFAULTS, ...props };
  const [, refresh] = useReducer((n: number) => n + 1, 0);
  const loader = useRef(load);
  loader.current = load;
  const chain = useRef<DependentChain>();
  chain.current ??= createDependentChain([{ name, parents }], (_node, filters) => loader.current(filters), refresh);
  const parentValues = parents.map((p) => values[p.field] ?? '').join('|');

  useEffect(() => {
    chain.current!.sync(values);
    // `parentValues` captures every parent value; the parents are static per field.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentValues]);

  const failed = chain.current.failed(name);
  const blocked = chain.current.blocked(name, values);
  return {
    ...DEPENDENTSELECT_DEFAULTS,
    name,
    label,
    options: blocked ? [] : chain.current.options(name),
    value: values[name] ?? '',
    disabled: readOnly || failed || blocked,
    loadFailed: failed,
    hasError,
    onValueChange: (value) => {
      if (!readOnly) onChange(value);
    },
    onRetry: () => chain.current!.retry(name, values),
  };
}
