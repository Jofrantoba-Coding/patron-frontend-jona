// Layer: Interface. Public contract of the perfil permission dialog (one option, or the matrix of every form): shapes and defaults only.
import { PERMISSION_FLAGS, type PermissionFlag, type Permissions } from '../../../domain/permissions';

/** One form of the dialog with the 13 flags as currently edited. */
export interface PermisoRow {
  formId: string;
  flags: Permissions;
}

export interface InterPermisosDialog {
  /** `Perfil {descripcion}`. */
  title: string;
  /** `OPCION: {NODE}` in option mode; absent in the matrix (perfil mode). */
  header?: string;
  saveLabel?: string;
  /** The toolbar button label of each flag. */
  flagLabels?: Record<PermissionFlag, string>;
  rows: PermisoRow[];
  /** Perfil mode: every form of the app as an accordion row, instead of the one form of the option. */
  matrix: boolean;
  status: 'loading' | 'ready' | 'failed';
  loadError?: string;
  saving: boolean;
  /** The server message of the last save (or the rule message on success), shown inside the dialog. */
  message?: { kind: 'ok' | 'error'; text: string };
  /** Callbacks are value-first. */
  onToggle: (formId: string, flag: PermissionFlag, value: boolean) => void;
  onSave: () => void;
  /** Close request, already guarded by the dialog stack. */
  onClose: () => void;
}

/** The flags are shown by their toolbar button labels (R-PRM-3). [INFERRED] the five the toolbar of W1 does not draw: `Anular`, `Reporte`, `Imprimir`, `Impresion Rapida`, `Cerrar`. */
export const PERMISOSDIALOG_DEFAULTS: Required<Pick<InterPermisosDialog, 'saveLabel' | 'flagLabels'>> = {
  saveLabel: 'Guardar',
  flagLabels: {
    add: 'Agregar',
    modify: 'Modificar',
    eliminate: 'Eliminar',
    nullify: 'Anular',
    clone: 'Clonar',
    details: 'Detalle',
    search: 'Buscar',
    report: 'Reporte',
    export: 'Exportar',
    print: 'Imprimir',
    printFast: 'Impresion Rapida',
    close: 'Cerrar',
    refresh: 'Actualizar',
  },
};

/** The cells that differ between the stored rows and the edited ones, in form then flag order: the only thing `Guardar` sends. */
export function changedCells(stored: PermisoRow[], edited: PermisoRow[]) {
  return stored.flatMap((row, i) =>
    PERMISSION_FLAGS.filter((flag) => edited[i].flags[flag] !== row.flags[flag]).map((flag) => ({ formId: row.formId, flag, value: edited[i].flags[flag] })),
  );
}
