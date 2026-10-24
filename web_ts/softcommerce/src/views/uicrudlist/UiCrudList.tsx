// Layer: public entry. Wires the Impl hook to the pure View and opens the register dialog.
import { useRef, useState, type ComponentType } from 'react';
import type { ActionConfig, CatalogConfig, CrudAction } from '../../catalogs/CatalogConfig';
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
  /** The `list-toolbar` actions (R-ACT-1) and, by the `rule` each names, the panel it opens on the selected row. */
  listActions?: readonly ActionConfig[];
  panels?: Record<string, ComponentType<ListPanelProps<T>>>;
}

/** What a list panel gets: the list config and the selected row, the form permissions and its way out. */
export interface ListPanelProps<T> {
  config: CatalogConfig<T>;
  row: T;
  permissions: Permissions;
  onClose: () => void;
}

const ACTION_MODES: Partial<Record<CrudAction, RegisterMode>> = {
  add: 'INSERT',
  modify: 'UPDATE',
  eliminate: 'DELETE',
  clone: 'CLONE',
  details: 'DETAIL',
};

/** Generic list for any catalog config: toolbar, filter, sortable paged grid, load states and its register dialog. */
export function UiCrudList<T>({ config, service, permissions, lookups, lookup, register: Register = UiCrudRegister, listActions, panels }: UiCrudListProps<T>) {
  const [register, setRegister] = useState<{ mode: RegisterMode; id?: string }>();
  const selected = useRef<string | undefined>();
  const [panel, setPanel] = useState<{ action: ActionConfig; row: T }>();
  const impl = useUiCrudListImpl(config, service, permissions, {
    onAction: (action) => {
      const mode = ACTION_MODES[action];
      if (mode) setRegister({ mode, id: mode === 'INSERT' ? undefined : selected.current });
    },
    listActions,
    onListAction: (action, row) => setPanel({ action, row }),
    onRowOpen: (id) => permissions.details && (config.modes?.includes('DETAIL') ?? true) && setRegister({ mode: 'DETAIL', id }),
  });
  selected.current = impl.selectedId;
  return (
    <>
      <UiCrudListView {...UICRUDLIST_DEFAULTS} {...impl} />
      {panel && panels?.[panel.action.rule ?? ''] && (() => {
        const Panel = panels[panel.action.rule ?? ''];
        return <Panel config={config} row={panel.row} permissions={permissions} onClose={() => setPanel(undefined)} />;
      })()}
      {register && (
        <Register
          config={config}
          service={service}
          lookups={lookups}
          lookup={lookup}
          permissions={permissions}
          {...register}
          onDone={({ id }) => void impl.refresh(id ? { select: id } : undefined)}
          onClose={() => setRegister(undefined)}
        />
      )}
    </>
  );
}
