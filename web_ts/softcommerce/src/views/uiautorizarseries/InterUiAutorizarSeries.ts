// Layer: Interface. Public contract of the Autorizar Series panel and its Activar dialog: shapes and defaults only, no logic.
import type { GridColumn } from '../../shared/ui/CrudGrid';
import type { LookupItem } from '../../services/InterLookupService';

/** A row of the usuario series: the W2 usuario-correlativos row with its joined names (R-PRM-7). */
export type SerieRow = Record<string, string | boolean | undefined>;

export interface SeriesNotice {
  title: string;
  message: string;
}

export interface InterUiAutorizarSeries {
  title?: string;
  trabajadorLabel?: string;
  usuarioLabel?: string;
  activarLabel?: string;
  desactivarLabel?: string;
  closeLabel?: string;
  /** The usuario catalog and the id of the selected usuario: the target of the actions. */
  catalog: string;
  parentId: string;
  /** Names of the usuario shown in the header. */
  trabajador: string;
  usuario: string;
  columns: GridColumn<SerieRow>[];
  idKey: string;
  rows: SerieRow[];
  selectedId?: string;
  status: 'loading' | 'ready' | 'failed';
  loadError?: string;
  canActivar: boolean;
  canDesactivar: boolean;
  notice?: SeriesNotice;
  /** The Activar dialog is open. */
  activating: boolean;
  /** Callbacks are value-first. */
  onSelectRow: (id: string) => void;
  onActivar: () => void;
  onDesactivar: () => void;
  /** The Activar dialog saved: its server message, then the grid reloads. */
  onActivated: (message: string) => void;
  onCloseActivar: () => void;
  onCloseNotice: () => void;
  onClose: () => void;
}

/** Presentation defaults only; rows, selection and notices are state and never defaulted. Labels are the desktop's, verbatim. */
export const UIAUTORIZARSERIES_DEFAULTS: Required<Pick<InterUiAutorizarSeries, 'title' | 'trabajadorLabel' | 'usuarioLabel' | 'activarLabel' | 'desactivarLabel' | 'closeLabel'>> = {
  title: 'Autorizar Series',
  trabajadorLabel: 'Trabajador:',
  usuarioLabel: 'Usuario:',
  activarLabel: 'Activar',
  desactivarLabel: 'Desactivar',
  closeLabel: 'Aceptar',
};

export interface ActivarValues {
  id_punto_venta: string;
  id_tipo_doc: string;
  id_correlativo: string;
  /** The masked `dd/MM/yyyy` text of the Fecha de Inicio. */
  fecha_inicio: string;
}

export interface InterActivarSerieDialog {
  title?: string;
  puntoLabel?: string;
  tipoLabel?: string;
  serieLabel?: string;
  idLabel?: string;
  fechaLabel?: string;
  saveLabel?: string;
  noSerieLabel?: string;
  values: ActivarValues;
  /** The series of the chosen pair came back empty. */
  noSerie: boolean;
  /** The refusal of the server or of the date, shown inside the dialog. */
  error?: string;
  saving: boolean;
  loadPuntos: () => Promise<LookupItem[]>;
  loadTipos: () => Promise<LookupItem[]>;
  loadSeries: (filters: Record<string, string>) => Promise<LookupItem[]>;
  onPuntoChange: (value: string) => void;
  onTipoChange: (value: string) => void;
  onSerieChange: (value: string) => void;
  onFechaChange: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export const ACTIVARSERIEDIALOG_DEFAULTS: Required<Pick<InterActivarSerieDialog, 'title' | 'puntoLabel' | 'tipoLabel' | 'serieLabel' | 'idLabel' | 'fechaLabel' | 'saveLabel' | 'noSerieLabel'>> = {
  title: 'Autorizar Series',
  puntoLabel: 'Punto de Venta',
  tipoLabel: 'Tipo de Documento',
  serieLabel: 'Serie',
  idLabel: 'Id Correlativo',
  fechaLabel: 'Fecha de Inicio',
  saveLabel: 'Guardar',
  noSerieLabel: 'No existe serie para esa combinacion',
};
