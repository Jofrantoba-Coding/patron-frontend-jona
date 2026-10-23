// Layer: Implementation. Load -> edit -> validate -> confirm -> execute of the generic crud register.
import { useEffect, useRef, useState } from 'react';
import type { CatalogConfig, FieldConfig } from '../../catalogs/CatalogConfig';
import { ruleDerived, ruleEffects } from '../../../mock-server/core/entryRules.js';
import { decodeValue } from '../../domain/crud/codec';
import { changeField, isEnabled, isVisible } from '../../domain/crud/conditional';
import { applyModeDefaults, initialValues, isFieldReadOnly } from '../../domain/crud/modeDefaults';
import { blurNormalize, normalize } from '../../domain/crud/normalize';
import { mapServerError } from '../../domain/crud/serverErrors';
import { validate, type FormValues } from '../../domain/crud/validate';
import type { InterCatalogService } from '../../services/InterCatalogService';
import type { InterLookupService, LookupItem } from '../../services/InterLookupService';
import { fieldsToClear, type ChainNode } from '../../shared/dependentChain';
import { toFailure, type Failure } from '../../shared/toFailure';
import { useGuardedClose } from '../uishell/DialogStackProvider';
import type { InterUiCrudRegister, RegisterConfirm, RegisterMode } from './InterUiCrudRegister';

export interface CrudRegisterHandlers {
  /** Loads whatever the fields need (select options, ubigeo roots); a rejection blocks the form. */
  lookups?: () => Promise<unknown>;
  /** Option source for the `select` and `cascade` fields. */
  lookup?: InterLookupService;
  /** Called after a successful execute; `id` is the created or edited row, absent after a delete. */
  onDone: (result: { id?: string }) => void;
  onClose: () => void;
}

type Load = { status: 'loading' } | { status: 'ready' } | { status: 'failed'; message: string };

const fieldNames = (fields: FieldConfig[]) => fields.flatMap((f) => (f.kind === 'cascade' ? f.levels.map((l) => l.name) : [f.name]));

function fromRecord(fields: FieldConfig[], record: unknown, mode: RegisterMode): FormValues {
  const source = record as Record<string, unknown>;
  // The codec reads each wire value into its string form (a boolean becomes 'true' | 'false').
  const values: FormValues = Object.fromEntries(
    fields.flatMap((field) =>
      field.kind === 'cascade' ? field.levels.map((level) => [level.name, String(source[level.name] ?? '')]) : [[field.name, decodeValue(field, source[field.name])]],
    ),
  );
  // A cascade stores only its leaf; the levels above come from the leaf's ancestors. A cascade that stores nothing (`restoreFrom`) takes
  // the leaf from the ubigeo code the record carries, cut to the leaf level.
  for (const field of fields) {
    if (field.kind !== 'cascade') continue;
    const leaf = field.restoreFrom ? String(source[field.restoreFrom.field] ?? '').slice(0, field.restoreFrom.prefixLen) : values[field.levels[field.levels.length - 1].name];
    const ids = leaf ? [...field.ancestorsOf(leaf), leaf] : [];
    field.levels.forEach((level, index) => (values[level.name] = ids[index] ?? ''));
  }
  // A clone is a new record: the server issues its code (R-CRUD-14).
  if (mode === 'CLONE') for (const field of fields) if (field.kind === 'code') values[field.name] = '';
  // A per-mode default wins over the stored value (a clone of a TipoCambio starts today).
  return applyModeDefaults(fields, values, mode);
}

/** The selects that depend on other fields; they load once their parents are known, not with the form. */
const chainOf = (fields: FieldConfig[]): ChainNode[] =>
  fields.flatMap((field) => (field.kind === 'select' && field.dependsOn?.length ? [{ name: field.name, parents: field.dependsOn }] : []));

async function loadSelectOptions(fields: FieldConfig[], lookup?: InterLookupService) {
  const selects = fields.flatMap((field) => (field.kind === 'select' && lookup && !field.dependsOn?.length ? [field] : []));
  // A registry select asks its catalog for active options, forwarding the static `where`; a W1 select names its lookup.
  const loaded = await Promise.all(
    selects.map(async (field) => [field.name, field.source ? await lookup!.options(field.source.catalog, field.source.where) : await lookup![field.lookup!]()] as const),
  );
  return Object.fromEntries(loaded);
}

export function useUiCrudRegisterImpl<T>(
  config: CatalogConfig<T>,
  service: InterCatalogService<T>,
  mode: RegisterMode,
  id: string | undefined,
  { lookups, lookup, onDone, onClose }: CrudRegisterHandlers,
): InterUiCrudRegister {
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [values, setValues] = useState<FormValues>(() => initialValues(config.fields, mode));
  const [selectOptions, setSelectOptions] = useState<Record<string, LookupItem[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState<RegisterConfirm | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [submitFailure, setSubmitFailure] = useState<Failure | undefined>();
  // The alert a named rule raised on the last edit (R-REF-8).
  const [ruleAlert, setRuleAlert] = useState<string | undefined>();
  // Field to focus once the confirm pane is gone (a server error names it).
  const [focusName, setFocusName] = useState<string | undefined>();
  const baseline = useRef<FormValues>(values);
  // The latest values, so two edits inside one tick each build on the other.
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});
  const lookupsRef = useRef(lookups);
  lookupsRef.current = lookups;
  const lookupRef = useRef(lookup);
  lookupRef.current = lookup;

  useEffect(() => {
    let active = true;
    Promise.all([
      lookupsRef.current?.(),
      mode === 'INSERT' ? undefined : service.get(id as string),
      loadSelectOptions(config.fields, lookupRef.current),
    ])
      .then(([, record, options]) => {
        if (!active) return;
        setSelectOptions(options);
        if (record) {
          baseline.current = fromRecord(config.fields, record, mode);
          setValues(baseline.current);
        }
        setLoad({ status: 'ready' });
      })
      .catch((error: unknown) => active && setLoad({ status: 'failed', message: toFailure(error).message }));
    return () => {
      active = false;
    };
  }, [service, mode, id, config.fields]);

  useEffect(() => {
    if (focusName && !confirm) {
      fieldRefs.current[focusName]?.focus();
      setFocusName(undefined);
    }
  }, [focusName, confirm]);

  const dirty = Object.keys(values).some((name) => values[name] !== baseline.current[name]);
  // A dirty editable form asks before discarding; anything else just closes.
  const guardedClose = useGuardedClose(true, () => (dirty && mode !== 'DELETE' && mode !== 'DETAIL' ? setConfirm('discard') : onClose()));

  async function execute() {
    setSubmitting(true);
    setSubmitFailure(undefined);
    try {
      const data = normalize(config.fields, values) as Partial<T>;
      let resultId = id;
      if (mode === 'INSERT' || mode === 'CLONE') resultId = String((await service.create(data))[config.idKey]);
      else if (mode === 'UPDATE') await service.update(id as string, data);
      else await service.remove(id as string);
      onDone(mode === 'DELETE' ? {} : { id: resultId });
      onClose();
    } catch (error) {
      const mapped = mapServerError(error, fieldNames(config.fields));
      setErrors(mapped.fields);
      setFocusName(mapped.first);
      setSubmitFailure(mapped.form);
      setSubmitting(false);
      setConfirm(undefined);
    }
  }

  const edit = (name: string, value: string) => {
    // A parent change empties the selects below it (G2), `clearsOnChange` its named fields and a field that just hid
    // (R-CRUD-13); their own errors go with them.
    const changed = changeField(config.fields, valuesRef.current, name, value, fieldsToClear(chainOf(config.fields), name));
    let next = changed.values;
    const cleared = [...changed.cleared];
    let alert: string | undefined;
    // Named rules (D9): an edit may clear the field it just made invalid and raise an alert, and the razon social is composed on every keystroke.
    if (config.entry?.rules?.length) {
      const effect = ruleEffects(config.entry, next, name);
      next = { ...next, ...effect.patch };
      cleared.push(...Object.keys(effect.patch));
      alert = effect.alert;
      const known = new Set(fieldNames(config.fields));
      next = { ...next, ...Object.fromEntries(Object.entries(ruleDerived(config.entry, next)).filter(([key]) => known.has(key))) };
    }
    valuesRef.current = next;
    setValues(next);
    setRuleAlert(alert);
    setErrors((current) => Object.fromEntries(Object.entries(current).filter(([key]) => key !== name && !cleared.includes(key))));
  };

  return {
    title: config.title,
    mode,
    fields: config.fields,
    values,
    errors,
    status: load.status,
    loadError: load.status === 'failed' ? load.message : undefined,
    submitError: submitFailure?.message,
    submitTraceId: submitFailure?.traceId,
    alert: ruleAlert,
    readOnly: mode === 'DELETE' || mode === 'DETAIL',
    isFieldReadOnly: (name) => {
      const field = config.fields.find((f) => f.name === name);
      // A disabled conditional field (`enabledWhen`) is shown but not editable.
      return field ? isFieldReadOnly(field, mode, mode === 'DELETE' || mode === 'DETAIL') || !isEnabled(field, values) : mode === 'DELETE' || mode === 'DETAIL';
    },
    isFieldVisible: (name) => {
      const field = config.fields.find((f) => f.name === name);
      return field ? isVisible(field, values) : true;
    },
    canSubmit: mode !== 'DETAIL' && load.status === 'ready' && !submitting,
    submitting,
    confirm,
    selectOptions,
    loadOptions: async (catalog, filters) => (await lookupRef.current?.options(catalog, filters)) ?? [],
    // A filtered cascade (`has: 'zonas'`) asks the lookup route; the plain one keeps the W1 route.
    loadChildren: async (parent, filter) => (filter ? await lookupRef.current?.options('ubigeo', { parent, ...filter }) : await lookupRef.current?.ubigeoChildren(parent)) ?? [],
    registerField: (name) => (element) => {
      fieldRefs.current[name] = element;
    },
    onFieldChange: edit,
    onFieldDefault: (name, value) => {
      // A select that picked its own option (S-CRUD-41) is not an edit: the pristine form keeps the pick as its baseline.
      baseline.current = { ...baseline.current, [name]: value };
      edit(name, value);
    },
    onFieldBlur: (name) => {
      const field = config.fields.find((f) => f.name === name);
      if (!field || isFieldReadOnly(field, mode, mode === 'DELETE' || mode === 'DETAIL')) return;
      setValues((current) => {
        const padded = blurNormalize(field, current[name] ?? '');
        return padded === current[name] ? current : { ...current, [name]: padded };
      });
    },
    onSubmit: () => {
      if (mode === 'DETAIL' || load.status !== 'ready' || submitting || confirm) return;
      const found = mode === 'DELETE' ? [] : validate(config.fields, values, config.entry && { entry: config.entry, mode });
      setErrors(Object.fromEntries(found.map((e) => [e.name, e.message])));
      if (found.length > 0) fieldRefs.current[found[0].name]?.focus();
      else setConfirm('submit');
    },
    onConfirm: () => (confirm === 'discard' ? onClose() : void execute()),
    onConfirmCancel: () => setConfirm(undefined),
    onClose: guardedClose,
  };
}
