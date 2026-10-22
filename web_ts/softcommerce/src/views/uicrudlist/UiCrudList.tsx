// Layer: public entry. Wires the Impl hook to the pure View and opens the register dialog.
import { useRef, useState } from 'react';
import type { CatalogConfig, CrudAction } from '../../catalogs/CatalogConfig';
import type { Permissions } from '../../domain/permissions';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { UiCrudRegister } from '../uicrudregister';
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
}

const ACTION_MODES: Partial<Record<CrudAction, RegisterMode>> = {
  add: 'INSERT',
  modify: 'UPDATE',
  eliminate: 'DELETE',
  clone: 'CLONE',
  details: 'DETAIL',
};

/** Generic list for any catalog config: toolbar, filter, sortable paged grid, load states and its register dialog. */
export function UiCrudList<T>({ config, service, permissions, lookups }: UiCrudListProps<T>) {
  const [register, setRegister] = useState<{ mode: RegisterMode; id?: string }>();
  const selected = useRef<string | undefined>();
  const impl = useUiCrudListImpl(config, service, permissions, {
    onAction: (action) => {
      const mode = ACTION_MODES[action];
      if (mode) setRegister({ mode, id: mode === 'INSERT' ? undefined : selected.current });
    },
    onRowOpen: (id) => permissions.details && setRegister({ mode: 'DETAIL', id }),
  });
  selected.current = impl.selectedId;
  return (
    <>
      <UiCrudListView {...UICRUDLIST_DEFAULTS} {...impl} />
      {register && (
        <UiCrudRegister
          config={config}
          service={service}
          lookups={lookups}
          {...register}
          onDone={({ id }) => void impl.refresh(id ? { select: id } : undefined)}
          onClose={() => setRegister(undefined)}
        />
      )}
    </>
  );
}
