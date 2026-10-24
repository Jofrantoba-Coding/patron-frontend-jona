// Layer: Interface. Public contract of the Socio acciones screen and its three inner dialogs: shapes and defaults only, no logic.

export type SocioAccionesTab = 'socios' | 'precio';

/** A price row of the Precio table (`AccionPrecioTableModel`): every cell is text, ready to draw. */
export interface PrecioGridRow {
  key: string;
  estado: string;
  id: string;
  precio: string;
  f_inicio: string;
  f_fin: string;
}

/** A socio row of the Socios table (`AccionSocioTableModel`). */
export interface SocioGridRow {
  key: string;
  estado: string;
  id: string;
  num_doc: string;
  socio: string;
  cantidad: string;
  precio: string;
  f_inicio: string;
  f_fin: string;
}

export interface Notice {
  title: string;
  message: string;
}

/** What the inner dialog on top of the screen is for. */
export type SocioAccionesDialog =
  | { kind: 'precio-activar' }
  | { kind: 'precio-desactivar'; precio: string; fechaInicio: string }
  | { kind: 'socio'; activos: string[] };

/** What the Activar/Desactivar Precio dialog hands back: the price (activate only) and the date as ISO. */
export interface PrecioDone {
  precio: number;
  fecha: string;
}

/** What the Activar Socio dialog hands back. */
export interface SocioDone {
  socio: { id_socio: string; numero_doc: string; descripcion: string };
  cantidad: number;
  fecha: string;
}

export interface InterUiSocioAcciones {
  title?: string;
  sociosTab?: string;
  precioTab?: string;
  activarLabel?: string;
  desactivarLabel?: string;
  aceptarLabel?: string;
  cancelarLabel?: string;
  /** Text of the screen once the dialog is closed. */
  closedHint?: string;
  loadingLabel?: string;
  /** The modal is open (the desktop `FormAccionSocio` is modal and has no other content). */
  open: boolean;
  status: 'loading' | 'ready' | 'failed';
  loadError?: string;
  tab: SocioAccionesTab;
  precios: PrecioGridRow[];
  socios: SocioGridRow[];
  selectedPrecio?: string;
  selectedSocio?: string;
  saving: boolean;
  notice?: Notice;
  dialog?: SocioAccionesDialog;
  /** Callbacks are value-first. */
  onTabChange: (tab: SocioAccionesTab) => void;
  onSelectPrecio: (key: string) => void;
  onSelectSocio: (key: string) => void;
  onActivarSocio: () => void;
  onDesactivarSocio: () => void;
  onActivarPrecio: () => void;
  onDesactivarPrecio: () => void;
  onPrecioDone: (done: PrecioDone) => void;
  onSocioDone: (done: SocioDone) => void;
  onCloseDialog: () => void;
  onAceptar: () => void;
  onCancelar: () => void;
  onOpen: () => void;
  onCloseNotice: () => void;
  /** The "Desea Desactivar Precio?" confirmation answered with Aceptar. */
  confirmDesactivar?: boolean;
  onConfirmDesactivar: () => void;
  onCancelConfirmDesactivar: () => void;
}

/** Presentation defaults only; the lists, tab and selections are state and never defaulted. Labels are the desktop's, verbatim. */
export const UISOCIOACCIONES_DEFAULTS: Required<
  Pick<InterUiSocioAcciones, 'title' | 'sociosTab' | 'precioTab' | 'activarLabel' | 'desactivarLabel' | 'aceptarLabel' | 'cancelarLabel' | 'closedHint' | 'loadingLabel'>
> = {
  title: 'Acciones de Socio',
  sociosTab: 'Socios',
  precioTab: 'Precio',
  activarLabel: 'Activar',
  desactivarLabel: 'Desactivar',
  aceptarLabel: 'Aceptar',
  cancelarLabel: 'Cancelar',
  closedHint: 'Las acciones de socio se editan en una ventana.',
  loadingLabel: 'Cargando...',
};

export interface InterPrecioDialog {
  title?: string;
  precioLabel?: string;
  activarLabel?: string;
  desactivarLabel?: string;
  /** `Activar` asks for a precio and a Fecha Inicio; `Desactivar` shows the precio and asks for a Fecha Fin. */
  mode: 'activar' | 'desactivar';
  /** The price of the row being deactivated. */
  precio: string;
  /** ISO fecha inicio of the row being deactivated; the Fecha Fin must be after it. */
  fechaInicio: string;
  onDone: (done: PrecioDone) => void;
  onClose: () => void;
}

export const PRECIODIALOG_DEFAULTS: Required<Pick<InterPrecioDialog, 'precioLabel' | 'activarLabel' | 'desactivarLabel'>> = {
  precioLabel: 'Precio',
  activarLabel: 'Activar',
  desactivarLabel: 'Desactivar',
};

export interface InterSocioDialog {
  title?: string;
  codigoLabel?: string;
  numeroLabel?: string;
  descripcionLabel?: string;
  cantidadLabel?: string;
  fechaLabel?: string;
  agregarLabel?: string;
  refrescarLabel?: string;
  cancelarLabel?: string;
  /** Ids of the socios already active on the screen. */
  activos: string[];
  onDone: (done: SocioDone) => void;
  onClose: () => void;
}

export const SOCIODIALOG_DEFAULTS: Required<
  Pick<InterSocioDialog, 'title' | 'codigoLabel' | 'numeroLabel' | 'descripcionLabel' | 'cantidadLabel' | 'fechaLabel' | 'agregarLabel' | 'refrescarLabel' | 'cancelarLabel'>
> = {
  title: 'Activar Socio',
  codigoLabel: 'Código',
  numeroLabel: 'DNI/RUC',
  descripcionLabel: 'R. Social',
  cantidadLabel: 'Cantidad',
  fechaLabel: 'Fecha Inicio',
  agregarLabel: 'Agregar',
  refrescarLabel: 'Refrescar',
  cancelarLabel: 'Cancelar',
};
