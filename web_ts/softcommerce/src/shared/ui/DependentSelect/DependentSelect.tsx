// Layer: public entry. Wires the Impl hook to the pure View.
import { forwardRef } from 'react';
import type { InterDependentSelect } from './InterDependentSelect';
import { useDependentSelectImpl } from './DependentSelectImpl';
import { DependentSelectView } from './DependentSelectView';

/** A select whose options depend on one or several parent fields (G2); the payload carries the id. */
export const DependentSelect = forwardRef<HTMLSelectElement, InterDependentSelect>((props, ref) => (
  <DependentSelectView ref={ref} {...useDependentSelectImpl(props)} />
));
DependentSelect.displayName = 'DependentSelect';
