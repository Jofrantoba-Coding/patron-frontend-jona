// Layer: Implementation. The generic register plus the tabs, the child drafts and the child dialog (D10).
import { useMemo, useRef, useState } from 'react';
import type { CatalogConfig, ChildConfig } from '../../catalogs/CatalogConfig';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { createDraftCatalogService, type DraftUniqueKey } from '../../shared/DraftCatalogService';
import type { RegisterMode } from '../uicrudregister/InterUiCrudRegister';
import { useUiCrudRegisterImpl, type CrudRegisterHandlers } from '../uicrudregister/UiCrudRegisterImpl';
import type { InterUiMasterRegister, MasterChildDialog } from './InterUiMasterRegister';
import { buildTabs, tabOfField } from './tabs';
import { useChildDraftsImpl, type ChildRow } from './useChildDraftsImpl';

export function useUiMasterRegisterImpl<T>(
  config: CatalogConfig<T>,
  service: InterCatalogService<T>,
  mode: RegisterMode,
  id: string | undefined,
  handlers: CrudRegisterHandlers,
): InterUiMasterRegister {
  const tabs = useMemo(() => buildTabs(config), [config]);
  const drafts = useChildDraftsImpl((config.children ?? []).map((child) => child.name));
  // The child dialog's service reads the grid at the moment of the confirm, not at the moment it opened.
  const draftsRef = useRef(drafts);
  draftsRef.current = drafts;
  // The register owns the active tab: a failed submit moves it to the tab of the first failing field (S-MD-1).
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [dialog, setDialog] = useState<MasterChildDialog>();
  const readOnly = mode === 'DELETE' || mode === 'DETAIL';

  const register = useUiCrudRegisterImpl(config, service, mode, id, handlers, {
    dirty: drafts.dirty,
    payload: drafts.payload,
    firstError: (name) => setActiveTab(tabOfField(tabs, config, name)),
  });

  const openChild = (child: ChildConfig) => {
    if (readOnly) return;
    setDialog({
      config: child.config,
      service: createDraftCatalogService<ChildRow>({
        unique: (child.config.entry as { unique?: DraftUniqueKey[] } | undefined)?.unique ?? [],
        siblings: () => draftsRef.current.siblings(child.name),
        onRow: (row) => draftsRef.current.add(child.name, row),
      }) as MasterChildDialog['service'],
      lookups: handlers.lookups,
      lookup: handlers.lookup,
      onClose: () => setDialog(undefined),
    });
  };

  return {
    register,
    tabs: tabs.map(({ key, title, fields, child }) => ({
      key,
      title,
      fields,
      ...(child && {
        grid: {
          title,
          columns: child.config.columns.map(({ key: column, header }) => ({ key: column, header })),
          rows: drafts.rows(child.name),
          selectedId: selected[child.name],
          readOnly,
          onSelect: (rowId: string) => setSelected((current) => ({ ...current, [child.name]: rowId })),
          onAdd: () => openChild(child),
        },
      }),
    })),
    activeTab,
    onTabChange: setActiveTab,
    childDialog: dialog,
  };
}
