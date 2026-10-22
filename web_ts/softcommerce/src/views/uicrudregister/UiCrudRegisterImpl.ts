// Layer: Implementation. Load -> edit -> validate -> confirm -> execute of the generic crud register.
import { useEffect, useRef, useState } from 'react';
import type { CatalogConfig, FieldConfig } from '../../catalogs/CatalogConfig';
import { normalize } from '../../domain/crud/normalize';
import { validate, type FormValues } from '../../domain/crud/validate';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { toFailure } from '../../shared/toFailure';
import { useGuardedClose } from '../uishell/DialogStackProvider';
import type { InterUiCrudRegister, RegisterConfirm, RegisterMode } from './InterUiCrudRegister';

export interface CrudRegisterHandlers {
  /** Loads whatever the fields need (select options, ubigeo roots); a rejection blocks the form. */
  lookups?: () => Promise<unknown>;
  /** Called after a successful execute; `id` is the created or edited row, absent after a delete. */
  onDone: (result: { id?: string }) => void;
  onClose: () => void;
}

type Load = { status: 'loading' } | { status: 'ready' } | { status: 'failed'; message: string };

const fieldNames = (fields: FieldConfig[]) => fields.flatMap((f) => (f.kind === 'cascade' ? f.levels.map((l) => l.name) : [f.name]));
const blank = (fields: FieldConfig[]): FormValues => Object.fromEntries(fieldNames(fields).map((name) => [name, '']));

function fromRecord(fields: FieldConfig[], record: unknown): FormValues {
  const source = record as Record<string, unknown>;
  return Object.fromEntries(fieldNames(fields).map((name) => [name, String(source[name] ?? '')]));
}

export function useUiCrudRegisterImpl<T>(
  config: CatalogConfig<T>,
  service: InterCatalogService<T>,
  mode: RegisterMode,
  id: string | undefined,
  { lookups, onDone, onClose }: CrudRegisterHandlers,
): InterUiCrudRegister {
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [values, setValues] = useState<FormValues>(() => blank(config.fields));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState<RegisterConfirm | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [submitFailure, setSubmitFailure] = useState<ReturnType<typeof toFailure> | undefined>();
  const baseline = useRef<FormValues>(values);
  const fieldRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const lookupsRef = useRef(lookups);
  lookupsRef.current = lookups;

  useEffect(() => {
    let active = true;
    Promise.all([lookupsRef.current?.(), mode === 'INSERT' ? undefined : service.get(id as string)])
      .then(([, record]) => {
        if (!active) return;
        if (record) {
          baseline.current = fromRecord(config.fields, record);
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
