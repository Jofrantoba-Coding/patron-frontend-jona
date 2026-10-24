// Layer: Impl hook of a host that opens a named picker (D4): `open` resolves with the pick, or undefined on cancel; the host renders `dialog`.
import { useCallback, useState, type ReactElement } from 'react';
import { PICKERS } from '../../../../mock-server/registry/pickers.js';
import type { AppServices } from '../../../services/serviceComposer';
import { useServices } from '../../../services/ServicesContext';
import { LookupDialog } from './LookupDialog';
import type { InterLookupDialog } from './InterLookupDialog';

type Row = Record<string, string>;
export interface LookupResult {
  row: Row;
  extras: Record<string, string>;
}
export type LookupOpenOptions = Pick<InterLookupDialog, 'preset' | 'veto'>;
type Opened = { picker: string; options: LookupOpenOptions; settle: (result?: LookupResult) => void };

/**
 * The props of the lookup dialog for a named picker (D4): the source list with the picker's static `where`, the select-filter options, and the row identity (the source's `id_*` column).
 * Shared by the hook and by a host that opens a picker itself (the master register of a `picker` child).
 */
export function pickerDialogProps(services: Pick<AppServices, 'catalog' | 'lookup'>, picker: string): Pick<InterLookupDialog, 'config' | 'idKey' | 'list' | 'loadOptions'> {
  if (!(picker in PICKERS)) throw new Error(`Unknown picker "${picker}".`);
  const config = PICKERS[picker];
  const service = services.catalog<Row>(config.source);
  return {
    config,
    // The row identity is the source's id column (every picker lists it, `id_*`).
    idKey: config.columns.find((column: { key: string }) => column.key.startsWith('id_'))!.key,
    list: ({ filters, page, pageSize }) => service.list({ page, pageSize, filters: { ...config.where, ...filters } }),
    loadOptions: (slug, filters) => services.lookup.options(slug, filters),
  };
}

export function useLookup(): { open: (picker: string, options?: LookupOpenOptions) => Promise<LookupResult | undefined>; dialog: ReactElement | null } {
  const services = useServices();
  const [opened, setOpened] = useState<Opened | undefined>();

  const open = useCallback(
    (picker: string, options: LookupOpenOptions = {}) => {
      if (!(picker in PICKERS)) return Promise.reject(new Error(`Unknown picker "${picker}".`));
      return new Promise<LookupResult | undefined>((resolve) => setOpened({ picker, options, settle: resolve }));
    },
    [],
  );

  if (!opened) return { open, dialog: null };
  return {
    open,
    dialog: (
      <LookupDialog
        {...pickerDialogProps(services, opened.picker)}
        preset={opened.options.preset}
        veto={opened.options.veto}
        onPick={(row, extras) => opened.settle({ row, extras })}
        onClose={() => {
          // A pick already settled the promise; closing without one settles it as cancelled.
          opened.settle(undefined);
          setOpened(undefined);
        }}
      />
    ),
  };
}
