// Layer: public entry. Wires the Impl hook to the pure View and opens the register dialog.
import { useRef, useState, type ComponentType } from 'react';
import type { CatalogConfig, CrudAction } from '../../catalogs/CatalogConfig';
import type { Permissions } from '../../domain/permissions';
import type { InterCatalogService } from '../../services/InterCatalogService';
import type { InterLookupService } from '../../services/InterLookupService';
import { UiCrudRegister, type UiCrudRegisterProps } from '../uicrudregister';
import type { RegisterMode } from '../uicrudregister/InterUiCrudRegister';
import { UICRUDLIST_DEFAULTS } from './InterUiCrudList';
import { useUiCrudListImpl } from './UiCrudListImpl';
import { UiCrudListView } from './UiCrudListView';

export interface UiCrudListProps<T> {
  config: CatalogConfig<T>;
  service: InterCatalogService<T>;
  permissions: Permissions;
  /** Loads the register's select options; a rejection blocks its form. */
  lookups?: () => Promise<unknown>;
  /** Option source for the register's `select` and `cascade` fields. */
  lookup?: InterLookupService;
  /** The register dialog the list opens; the generic one unless the catalog needs another (a master register, D10). */
  register?: ComponentType<UiCrudRegisterProps<T>>;
}

const ACTION_MODES: Partial<Record<CrudAction, RegisterMode>> = {
  add: 'INSERT',
  modify: 'UPDATE',
  eliminate: 'DELETE',
  clone: 'CLONE',
  details: 'DETAIL',
};

/** Generic list for any catalog config: toolbar, filter, sortable paged grid, load states and its register dialog. */
export function UiCrudList<T>({ config, service, permissions, lookups, lookup, register: Register = UiCrudRegister }: UiCrudListProps<T>) {
  const [register, setRegister] = useState<{ mode: RegisterMode; id?: string }>();
  const selected = useRef<string | undefined>();
  const impl = useUiCrudListImpl(config, service, permissions, {
    onAction: (action) => {
      const mode = ACTION_MODES[action];
      if (mode) setRegister({ mode, id: mode === 'INSERT' ? undefined : selected.current });
    },
    onRowOpen: (id) => permissions.details && (config.modes?.includes('DETAIL') ?? true) && setRegister({ mode: 'DETAIL', id }),
  });
  selected.current = impl.selectedId;
  return (
    <>
      <UiCrudListView {...UICRUDLIST_DEFAULTS} {...impl} />
      {register && (
        <Register
          config={config}
          service={service}
          lookups={lookups}
          lookup={lookup}
          {...register}
          onDone={({ id }) => void impl.refresh(id ? { select: id } : undefined)}
          onClose={() => setRegister(undefined)}
        />
      )}
    </>
  );
}
