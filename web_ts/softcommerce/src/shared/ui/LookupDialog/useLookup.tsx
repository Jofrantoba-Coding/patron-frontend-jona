// Layer: Impl hook of a host that opens a named picker (D4): `open` resolves with the pick, or undefined on cancel; the host renders `dialog`.
import { useCallback, useState, type ReactElement } from 'react';
import { PICKERS } from '../../../../mock-server/registry/pickers.js';
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

export function useLookup(): { open: (picker: string, options?: LookupOpenOptions) => Promise<LookupResult | undefined>; dialog: ReactElement | null } {
  const { catalog, lookup } = useServices();
  const [opened, setOpened] = useState<Opened | undefined>();

  const open = useCallback(
    (picker: string, options: LookupOpenOptions = {}) => {
      if (!(picker in PICKERS)) return Promise.reject(new Error(`Unknown picker "${picker}".`));
      return new Promise<LookupResult | undefined>((resolve) => setOpened({ picker, options, settle: resolve }));
    },
    [],
  );

  if (!opened) return { open, dialog: null };
  const config = PICKERS[opened.picker];
  const service = catalog<Row>(config.source);
  return {
    open,
    dialog: (
      <LookupDialog
        config={config}
        // The row identity is the source's id column (every picker lists it, `id_*`).
        idKey={config.columns.find((column: { key: string }) => column.key.startsWith('id_'))!.key}
        list={({ filters, page, pageSize }) => service.list({ page, pageSize, filters: { ...config.where, ...filters } })}
        loadOptions={(slug, filters) => lookup.options(slug, filters)}
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
