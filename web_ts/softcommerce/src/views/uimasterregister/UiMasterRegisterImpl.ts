// Layer: Implementation. The generic register plus the tabs, the child drafts and the child dialog (D10).
import { useMemo, useRef, useState } from 'react';
import type { CatalogConfig, ChildConfig } from '../../catalogs/CatalogConfig';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { createDraftCatalogService, type DraftUniqueKey } from '../../shared/DraftCatalogService';
import type { RegisterMode } from '../uicrudregister/InterUiCrudRegister';
import { useUiCrudRegisterImpl, type CrudRegisterHandlers } from '../uicrudregister/UiCrudRegisterImpl';
import type { InterUiMasterRegister, MasterChildDialog, MasterQuitarConfirm } from './InterUiMasterRegister';
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
  const drafts = useChildDraftsImpl((config.children ?? []).map((child) => child.name), Object.fromEntries((config.children ?? []).map((child) => [child.name, child.config.idKey])));
  // The child dialog's service reads the grid at the moment of the confirm, not at the moment it opened.
  const draftsRef = useRef(drafts);
  draftsRef.current = drafts;
  // The register owns the active tab: a failed submit moves it to the tab of the first failing field (S-MD-1).
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [dialog, setDialog] = useState<MasterChildDialog>();
  const [notice, setNotice] = useState<{ child: string; text: string }>();
  const [asking, setAsking] = useState<{ child: ChildConfig; key: string }>();
  const readOnly = mode === 'DELETE' || mode === 'DETAIL';

  const register = useUiCrudRegisterImpl(config, service, mode, id, handlers, {
    dirty: drafts.dirty,
    payload: drafts.payload,
    firstError: (name) => setActiveTab(tabOfField(tabs, config, name)),
  });

  const remove = (child: ChildConfig, key: string) => {
    drafts.quitar(child.name, key, child.removal);
    setSelected(({ [child.name]: _gone, ...rest }) => rest);
  };
  // Quitar acts on the selected row: no selection and an already deactivated row only say so; the desktop question comes before the change (R-MD-4).
  const quitar = (child: ChildConfig) => {
    setNotice(undefined);
    const key = selected[child.name];
    const row = key === undefined ? undefined : drafts.rows(child.name).find((candidate) => candidate._key === key);
    if (!row) setNotice({ child: child.name, text: child.quitar.none });
    else if (row.estado === 'D') setNotice({ child: child.name, text: child.quitar.already });
    else if (child.quitar.confirm) setAsking({ child, key: row._key });
    else remove(child, row._key);
  };
  const quitarConfirm: MasterQuitarConfirm | undefined = asking && {
    title: asking.child.title,
    description: asking.child.quitar.confirm as string,
    onConfirm: () => {
      remove(asking.child, asking.key);
      setAsking(undefined);
    },
    onCancel: () => setAsking(undefined),
  };

  // One draft service per child, built once: the register hook reloads when its service changes.
  const services = useMemo(
    () =>
      new Map(
        (config.children ?? []).map((child) => [
          child.name,
          createDraftCatalogService<ChildRow>({
            unique: (child.config.entry as { unique?: DraftUniqueKey[] } | undefined)?.unique ?? [],
            siblings: () => draftsRef.current.siblings(child.name),
            onRow: (row) => draftsRef.current.add(child.name, row),
          }) as MasterChildDialog['service'],
        ]),
      ),
    [config.children],
  );
  const parts = (child: ChildConfig) => ({ config: child.config, service: services.get(child.name) as MasterChildDialog['service'], lookups: handlers.lookups, lookup: handlers.lookup });

  const openChild = (child: ChildConfig) => {
    if (readOnly) return;
    setNotice(undefined);
    setDialog({ ...parts(child), onClose: () => setDialog(undefined) });
  };

  return {
    register,
    tabs: tabs.map(({ key, title, fields, child }) => ({
      key,
      title,
      fields,
      ...(child?.entryMode === 'inline' && !readOnly && { inline: parts(child) }),
      ...(child && {
        grid: {
          title,
          columns: child.config.columns.map(({ key: column, header }) => ({ key: column, header })),
          rows: drafts.rows(child.name),
          selectedId: selected[child.name],
          readOnly,
          onSelect: (rowId: string) => setSelected((current) => ({ ...current, [child.name]: rowId })),
          ...(child.entryMode === 'dialog' || readOnly ? { onAdd: () => openChild(child) } : {}),
          ...(child.removal !== 'none' && { onRemove: () => quitar(child) }),
          ...(notice?.child === child.name && { notice: notice.text }),
        },
      }),
    })),
    activeTab,
    onTabChange: setActiveTab,
    childDialog: dialog,
    quitarConfirm,
  };
}
