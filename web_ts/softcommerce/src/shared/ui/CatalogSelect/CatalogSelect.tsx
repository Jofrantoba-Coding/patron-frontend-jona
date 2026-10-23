// Layer: public entry. Wires the Impl hook to the pure View.
import { forwardRef } from 'react';
import type { InterCatalogSelect } from './InterCatalogSelect';
import { useCatalogSelectImpl } from './CatalogSelectImpl';
import { CatalogSelectView } from './CatalogSelectView';

/** A select over the active rows of a catalog lookup (G1); the payload carries the id. */
export const CatalogSelect = forwardRef<HTMLSelectElement, InterCatalogSelect>((props, ref) => (
  <CatalogSelectView ref={ref} {...useCatalogSelectImpl(props)} />
));
CatalogSelect.displayName = 'CatalogSelect';
