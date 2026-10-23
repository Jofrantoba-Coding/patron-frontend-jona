// Layer: Implementation. Load -> edit -> validate -> confirm -> execute of the generic crud register.
import { useEffect, useRef, useState } from 'react';
import type { CatalogConfig, FieldConfig } from '../../catalogs/CatalogConfig';
import { normalize } from '../../domain/crud/normalize';
import { validate, type FormValues } from '../../domain/crud/validate';
import type { InterCatalogService } from '../../services/InterCatalogService';
import type { InterLookupService, LookupItem } from '../../services/InterLookupService';
import { toFailure } from '../../shared/toFailure';
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
const blank = (fields: FieldConfig[]): FormValues => Object.fromEntries(fieldNames(fields).map((name) => [name, '']));

function fromRecord(fields: FieldConfig[], record: unknown, mode: RegisterMode): FormValues {
  const source = record as Record<string, unknown>;
  const values = Object.fromEntries(fieldNames(fields).map((name) => [name, String(source[name] ?? '')]));
  // A cascade stores only its leaf; the levels above come from the leaf's ancestors.
  for (const field of fields) {
    if (field.kind !== 'cascade') continue;
    const leaf = values[field.levels[field.levels.length - 1].name];
    const ids = leaf ? [...field.ancestorsOf(leaf), leaf] : [];
    field.levels.forEach((level, index) => (values[level.name] = ids[index] ?? ''));
  }
  // A clone is a new record: the server issues its code (R-CRUD-14).
  if (mode === 'CLONE') for (const field of fields) if (field.kind === 'code') values[field.name] = '';
  return values;
}

async function loadSelectOptions(fields: FieldConfig[], lookup?: InterLookupService) {
  const selects = fields.flatMap((field) => (field.kind === 'select' && lookup ? [field] : []));
  const loaded = await Promise.all(selects.map(async (field) => [field.name, await lookup![field.lookup]()] as const));
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
  const [values, setValues] = useState<FormValues>(() => blank(config.fields));
  const [selectOptions, setSelectOptions] = useState<Record<string, LookupItem[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState<RegisterConfirm | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [submitFailure, setSubmitFailure] = useState<ReturnType<typeof toFailure> | undefined>();
  const baseline = useRef<FormValues>(values);
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
      setSubmitFailure(toFailure(error));
      setSubmitting(false);
      setConfirm(undefined);
    }
  }

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
    readOnly: mode === 'DELETE' || mode === 'DETAIL',
    canSubmit: mode !== 'DETAIL' && load.status === 'ready' && !submitting,
    submitting,
    confirm,
    selectOptions,
    loadChildren: async (parent) => (await lookupRef.current?.ubigeoChildren(parent)) ?? [],
    registerField: (name) => (element) => {
      fieldRefs.current[name] = element;
    },
    onFieldChange: (name, value) => {
      setValues((current) => ({ ...current, [name]: value }));
      setErrors(({ [name]: _cleared, ...rest }) => rest);
    },
    onSubmit: () => {
      if (mode === 'DETAIL' || load.status !== 'ready' || submitting || confirm) return;
      const found = mode === 'DELETE' ? [] : validate(config.fields, values);
      setErrors(Object.fromEntries(found.map((e) => [e.name, e.message])));
      if (found.length > 0) fieldRefs.current[found[0].name]?.focus();
      else setConfirm('submit');
    },
    onConfirm: () => (confirm === 'discard' ? onClose() : void execute()),
    onConfirmCancel: () => setConfirm(undefined),
    onClose: guardedClose,
  };
}
