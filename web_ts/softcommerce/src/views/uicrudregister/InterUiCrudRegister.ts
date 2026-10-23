// Layer: Interface. Public contract of the generic crud register dialog: shapes and defaults only, no logic.
import type { CrudMode, FieldConfig } from '../../catalogs/CatalogConfig';
import type { FormValues } from '../../domain/crud/validate';
import type { LookupItem } from '../../services/InterLookupService';

export type RegisterMode = CrudMode;
export type RegisterStatus = 'loading' | 'ready' | 'failed';
/** Which confirmation is on screen, if any. */
export type RegisterConfirm = 'submit' | 'discard';

export interface InterUiCrudRegister {
  title: string;
  mode: RegisterMode;
  fields: FieldConfig[];
  values: FormValues;
  /** Field name -> message. */
  errors: Record<string, string>;
  status: RegisterStatus;
  /** Why the lookups or the record could not load. */
  loadError?: string;
  /** Message of a failed submit; the dialog stays open. */
  submitError?: string;
  submitTraceId?: string;
  /** The whole form is read-only (DELETE, DETAIL). */
  readOnly: boolean;
  /** True when the named field is not editable in this mode: the form is read-only or the field lists the mode in `readOnlyOn`. */
  isFieldReadOnly: (name: string) => boolean;
  /** False while a conditional field's `visibleWhen` fails: the view does not render it (R-CRUD-13). */
  isFieldVisible: (name: string) => boolean;
  canSubmit: boolean;
  submitting: boolean;
  confirm?: RegisterConfirm;
  /** Callbacks are value-first. */
  onFieldChange: (name: string, value: string) => void;
  /** A select picked its own option (`defaultOption`): like a change, but the pristine form keeps it as its baseline. */
  onFieldDefault: (name: string, value: string) => void;
  /** Focus left the field: a `padLeft` field shows its padded value (S-CRUD-35). */
  onFieldBlur: (name: string) => void;
  /** Options per select field name, loaded with the form. */
  selectOptions: Record<string, LookupItem[]>;
  /** Options of a catalog for the given filters, for the selects that depend on other fields (G2). */
  loadOptions: (catalog: string, filters: Record<string, string>) => Promise<LookupItem[]>;
  /** Children of a cascade parent id; '' asks for the top level. The cascade `filter`, when it has one, narrows them. */
  loadChildren: (parent: string, filter?: Record<string, string>) => Promise<LookupItem[]>;
  /** Ref callback per field name, so a blocked submit can focus the first invalid one. */
  registerField: (name: string) => (element: HTMLElement | null) => void;
  onSubmit: () => void;
  onConfirm: () => void;
  onConfirmCancel: () => void;
  /** Close request, already guarded by the dialog stack. */
  onClose: () => void;
}

/** Presentation defaults only; values, status and errors are state and never defaulted. */
export const UICRUDREGISTER_DEFAULTS = {
  loadingLabel: 'Cargando...',
  selectPlaceholder: 'Seleccione',
  submitLabel: 'Aceptar',
  cancelLabel: 'Cancelar',
  confirmLabel: 'Confirmar',
  declineLabel: 'No',
  modeLabels: { INSERT: 'Nuevo', UPDATE: 'Modificar', DELETE: 'Eliminar', CLONE: 'Clonar', DETAIL: 'Detalle' } as Record<RegisterMode, string>,
  confirmMessage: '¿Desea continuar con esta operación?',
  discardTitle: 'Descartar cambios',
  discardMessage: '¿Descartar los cambios sin guardar?',
};
