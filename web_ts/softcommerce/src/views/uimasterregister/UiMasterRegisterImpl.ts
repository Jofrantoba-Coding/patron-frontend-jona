// Layer: Implementation. The generic register plus the tabs, the child drafts and the child dialog (D10).
import { useMemo, useRef, useState } from 'react';
import { todayIso } from '../../../mock-server/core/dates.js';
import { effectiveField, gateOpen } from '../../../mock-server/core/predicates.js';
import type { ActionConfig, CatalogConfig, ChildConfig } from '../../catalogs/CatalogConfig';
import { ACTION_RULES } from '../../domain/crud/actionRules';
import { formatRows } from '../../domain/crud/listView';
import { resolveRowAction } from '../../domain/crud/toolbarGate';
import type { Permissions } from '../../domain/permissions';
import { ApiError } from '../../services/ApiError';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { useOptionalServices } from '../../services/ServicesContext';
import { useOptionalSession } from '../../session/SessionProvider';
import { toFailure } from '../../shared/toFailure';
import { createDraftCatalogService, type DraftUniqueKey } from '../../shared/DraftCatalogService';
import { pickerDialogProps } from '../../shared/ui/LookupDialog/useLookup';
import type { RegisterMode } from '../uicrudregister/InterUiCrudRegister';
import { useUiCrudRegisterImpl, type CrudRegisterHandlers } from '../uicrudregister/UiCrudRegisterImpl';
import type { InterUiMasterRegister, MasterChildDialog, MasterQuitarConfirm } from './InterUiMasterRegister';
import { buildTabs, tabOfField } from './tabs';
import { useChildDraftsImpl, type ChildRow, type DraftRow } from './useChildDraftsImpl';

export function useUiMasterRegisterImpl<T>(
  config: CatalogConfig<T>,
  service: InterCatalogService<T>,
  mode: RegisterMode,
  id: string | undefined,
  handlers: CrudRegisterHandlers,
  permissions?: Permissions,
): InterUiMasterRegister {
  // A child or a field whose company-parameter gate is closed does not exist for this register: no tab, no rows, no ops, no control, nothing validated or sent (R-REG-17, S-MD-14, S-REG-25).
  const params: Record<string, unknown> | undefined = useOptionalSession()?.session?.params as Record<string, unknown> | undefined;
  const kids = useMemo(() => (config.children ?? []).filter((child) => gateOpen(child.gate, params)), [config.children, params]);
  // A field that a parameter changes (`byParam`, R-MST-11) is taken as it is for the session: the zona required, the cascade filtered.
  const fields = useMemo(
    () => config.fields.filter((field) => gateOpen('gate' in field ? field.gate : undefined, params)).map((field) => effectiveField(field, params)),
    [config.fields, params],
  );
  const gated = useMemo(() => ({ ...config, fields, children: kids }), [config, fields, kids]);
  const tabs = useMemo(() => buildTabs(gated), [gated]);
  const app = useOptionalServices();
  const childService = app?.children(config.catalog);
  const drafts = useChildDraftsImpl(kids.map((child) => child.name), Object.fromEntries(kids.map((child) => [child.name, child.config.idKey])));
  // The child dialog's service reads the grid at the moment of the confirm, not at the moment it opened.
  const draftsRef = useRef(drafts);
  draftsRef.current = drafts;
  // The register owns the active tab: a failed submit moves it to the tab of the first failing field (S-MD-1).
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [dialog, setDialog] = useState<MasterChildDialog>();
  const [notice, setNotice] = useState<{ child: string; text: string }>();
  // What the server rejected, by child and row key (R-MD-5).
  const [rowErrors, setRowErrors] = useState<Record<string, Record<string, string>>>({});
  const [asking, setAsking] = useState<{ child: ChildConfig; key: string }>();
  // The `picker` child whose picker is open (R-MST-12).
  const [picking, setPicking] = useState<ChildConfig>();
  // The question of a row action that declares a `confirm` (R-ACT-1).
  const [askingAction, setAskingAction] = useState<MasterQuitarConfirm>();
  const readOnly = mode === 'DELETE' || mode === 'DETAIL';

  const register = useUiCrudRegisterImpl(gated, service, mode, id, handlers, {
    dirty: drafts.dirty,
    payload: drafts.payload,
    // UPDATE, DETAIL and DELETE restore every child beside the parent; INSERT has none and CLONE drops them (R-MD-9, D11).
    restore: async () => {
      if (!childService || mode === 'INSERT' || mode === 'CLONE') return;
      const loaded = await Promise.all(kids.map(async (child) => [child.name, (await childService.list(id as string, child.name, { pageSize: 1000 })).items] as const));
      draftsRef.current.load(Object.fromEntries(loaded));
    },
    firstError: (name) => setActiveTab(tabOfField(tabs, gated, name)),
    // Each failure lands on the pending row that was sent at that index, and the register shows the tab of the first one.
    childErrors: (errors) => {
      const placed = errors.flatMap((error) => {
        const key = draftsRef.current.opKey(error.child, error.index);
        return key === undefined ? [] : [{ ...error, key }];
      });
      setRowErrors(placed.reduce<Record<string, Record<string, string>>>((all, { child, key, message }) => ({ ...all, [child]: { ...all[child], [key]: all[child]?.[key] ?? message } }), {}));
      if (placed.length > 0) setActiveTab(`child:${placed[0].child}`);
    },
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

  // Row actions (R-ACT-1..6, D12). The one gate for click and keyboard is `allowed`: a disabled action sends nothing and opens nothing.
  const selectedRow = (child: ChildConfig) => draftsRef.current.rows(child.name).find((row) => row._key === selected[child.name]);
  const liveRows = (child: ChildConfig) => draftsRef.current.rows(child.name).filter((row) => row.activo !== false);
  const allowed = (child: ChildConfig, action: ActionConfig) => {
    const row = selectedRow(child);
    return resolveRowAction(action, { permissions, mode, selected: row, selectedPending: row?._key.startsWith('~'), rows: liveRows(child), hasParent: mode !== 'INSERT' && mode !== 'CLONE' });
  };
  const refreshRows = async (child: ChildConfig) => draftsRef.current.loadOne(child.name, (await (childService as NonNullable<typeof childService>).list(id as string, child.name, { pageSize: 1000 })).items);
  // A deferred action asks its client rule what to change in the pending rows; an immediate one calls the endpoint, then reloads the grid (R-ACT-4, R-ACT-6).
  const perform = async (child: ChildConfig, action: ActionConfig, input: Record<string, any>) => {
    const row = selectedRow(child);
    if (action.kind === 'deferred') {
      const rule = ACTION_RULES[action.rule as string];
      if (!rule) throw new Error(`Unknown action rule "${action.rule}".`);
      const call = { rows: liveRows(child), selected: row, input, params: action.params ?? {} };
      const refusal = rule.guard?.(call);
      if (refusal) throw new Error(refusal);
      const effect = rule.apply(call);
      // The grid shows the joined name of a picked select (the padron) on the pending row too, as the server adds it to the persisted ones.
      if (effect.insert) draftsRef.current.add(child.name, await withNames(child, effect.insert));
      if (effect.change && row) draftsRef.current.change(child.name, row._key, effect.change.patch ?? {}, effect.change.estado);
      if (effect.remove && row) remove(child, row._key);
      for (const [name, value] of Object.entries(effect.parent ?? {})) register.onFieldChange(name, value);
      return;
    }
    if (!app) throw new Error('An immediate action needs a ServicesProvider.');
    const target = { id: id as string, child: child.name, ...(action.enabledWhen?.selection === true && row ? { childId: row._key } : {}) };
    try {
      const result = await app.actions(config.catalog).run(target, action.id, input);
      await refreshRows(child);
      setNotice(result.message ? { child: child.name, text: result.message } : undefined);
    } catch (error) {
      // The row vanished: the grid shows what is left and says why; any other refusal is the caller's (dialog or notice).
      if (!(error instanceof ApiError && error.status === 404)) throw error;
      await refreshRows(child);
      setNotice({ child: child.name, text: error.message });
    }
  };
  const startAction = (child: ChildConfig, action: ActionConfig) => {
    if (!action.dialog) {
      perform(child, action, {}).catch((error: unknown) => setNotice({ child: child.name, text: toFailure(error).message }));
      return;
    }
    const never = () => Promise.reject(new Error('An action dialog only collects input.'));
    setDialog({
      config: { formId: action.id, title: action.dialog.title, catalog: '', idKey: 'id', columns: [], fields: action.dialog.fields, modes: ['INSERT'] },
      service: { create: async (values: Record<string, string>) => { await perform(child, action, values); return { id: '' }; }, get: never, list: never, update: never, remove: never } as unknown as MasterChildDialog['service'],
      lookups: handlers.lookups,
      lookup: handlers.lookup,
      onClose: () => setDialog(undefined),
    });
  };
  const runAction = (child: ChildConfig, actionId: string) => {
    const action = child.actions?.find((candidate) => candidate.id === actionId);
    if (!action || !allowed(child, action)) return;
    setNotice(undefined);
    // A deferred rule may refuse before its dialog opens (the anexo guards, R-ANX-3/4); an empty text refuses silently.
    const refusal = action.kind === 'deferred' ? ACTION_RULES[action.rule as string]?.check?.({ rows: liveRows(child), selected: selectedRow(child), input: {}, params: action.params ?? {} }) : undefined;
    if (refusal !== undefined) {
      if (refusal) setNotice({ child: child.name, text: refusal });
      return;
    }
    if (!action.confirm) return startAction(child, action);
    setAskingAction({
      title: action.label,
      description: action.confirm,
      onConfirm: () => {
        setAskingAction(undefined);
        startAction(child, action);
      },
      onCancel: () => setAskingAction(undefined),
    });
  };

  // A new master (INSERT, CLONE) has no history yet, but the server creates the child's `initial` row on save (R-MD-9): the grid shows it, display only, never sent.
  const initialRows = (child: ChildConfig): DraftRow[] => {
    const initial = (child.config.entry as { initial?: Record<string, unknown> } | undefined)?.initial;
    if (!initial || (mode !== 'INSERT' && mode !== 'CLONE')) return [];
    const today = Object.fromEntries(child.config.fields.filter((field) => field.kind === 'date' && field.default === 'today').map((field) => [field.name, todayIso()]));
    return [{ ...today, ...initial, _key: '~initial', estado: 'A' }];
  };

  // A pending row holds the ids the entry sent; the grid shows the joined names too (`MARCA`, `MODELO`), which the server adds only on the persisted rows. A join over a
  // select field of the entry takes the name of its option (the lookup option name is the display of the join); one over a field the entry does not show stays empty.
  const withNames = async (child: ChildConfig, row: ChildRow): Promise<ChildRow> => {
    const joins = (child.config.entry as { joins?: { as: string; ref: string }[] } | undefined)?.joins ?? [];
    if (!app) return row;
    const named = await Promise.all(
      joins.map(async ({ as, ref }) => {
        const field = child.config.fields.find((candidate) => candidate.name === ref);
        if (field?.kind !== 'select' || !field.source || !row[ref]) return [];
        const hit = (await app.lookup.options(field.source.catalog, field.source.where)).find((option) => option.id === String(row[ref]));
        return hit ? [[as, hit.name]] : [];
      }),
    );
    return { ...row, ...Object.fromEntries(named.flat()) };
  };

  // One draft service per child, built once: the register hook reloads when its service changes.
  const services = useMemo(
    () =>
      new Map(
        kids.map((child) => [
          child.name,
          createDraftCatalogService<ChildRow>({
            unique: (child.config.entry as { unique?: DraftUniqueKey[] } | undefined)?.unique ?? [],
            siblings: () => draftsRef.current.siblings(child.name),
            onRow: async (row) => draftsRef.current.add(child.name, await withNames(child, row)),
          }) as MasterChildDialog['service'],
        ]),
      ),
    [kids],
  );
  // The child dialogs take their fields the same way; memoized because a new `fields` identity reloads the register (D-W3-5b-6).
  const childConfigs = useMemo(() => Object.fromEntries(kids.map((child) => [child.name, { ...child.config, fields: child.config.fields.map((field) => effectiveField(field, params)) }])), [kids, params]);
  const parts = (child: ChildConfig) => ({ config: childConfigs[child.name], service: services.get(child.name) as MasterChildDialog['service'], lookups: handlers.lookups, lookup: handlers.lookup });

  const openChild = (child: ChildConfig) => {
    if (readOnly) return;
    setNotice(undefined);
    if (child.pick) setPicking(child);
    else setDialog({ ...parts(child), onClose: () => setDialog(undefined) });
  };

  // A `picker` child adds its row from the pick (FormClienteBuscar): the host veto refuses a cliente that is already an active row of the grid, or the cliente being edited, and the dialog
  // stays open; the pending row keeps the id and the display columns the grid shows before the save (they are not sent: the server joins them).
  const pickerDialog = (() => {
    const pick = picking?.pick;
    if (!picking || !pick || !app) return undefined;
    const base = pickerDialogProps(app, pick.picker);
    const idOf = (row: Record<string, string>) => String(row[base.idKey]);
    return {
      ...base,
      veto: (row: Record<string, string>) => (idOf(row) === id || draftsRef.current.siblings(picking.name).some((sibling) => String(sibling[pick.field]) === idOf(row)) ? pick.message : undefined),
      onPick: (row: Record<string, string>) => {
        draftsRef.current.add(picking.name, { [pick.field]: idOf(row), ...Object.fromEntries(Object.entries(pick.copy ?? {}).map(([column, key]) => [column, row[key]])) });
        setPicking(undefined);
      },
      onClose: () => setPicking(undefined),
    };
  })();

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
          // The shown rows follow the column formats (dd/MM/yyyy dates, R-ANX-1); the drafts keep the stored values.
          rows: formatRows(child.config.columns, [...drafts.rows(child.name), ...initialRows(child)]),
          selectedId: selected[child.name],
          readOnly,
          onSelect: (rowId: string) => setSelected((current) => ({ ...current, [child.name]: rowId })),
          ...(child.entryMode !== 'none' && (child.entryMode === 'dialog' || child.entryMode === 'picker' || readOnly) ? { onAdd: () => openChild(child) } : {}),
          ...(child.removal !== 'none' && { onRemove: () => quitar(child) }),
          ...(child.actions?.length && { actions: child.actions.map((action) => ({ id: action.id, label: action.label, disabled: !allowed(child, action) })), onAction: (actionId: string) => runAction(child, actionId) }),
          ...(rowErrors[child.name] && { rowErrors: rowErrors[child.name] }),
          ...(notice?.child === child.name && { notice: notice.text }),
        },
      }),
    })),
    activeTab,
    onTabChange: setActiveTab,
    childDialog: dialog,
    pickerDialog,
    quitarConfirm: quitarConfirm ?? askingAction,
  };
}
