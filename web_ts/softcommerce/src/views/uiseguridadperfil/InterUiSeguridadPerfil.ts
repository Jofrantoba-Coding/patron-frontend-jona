// Layer: Interface. Public contract of the Seguridad - Perfil screen: shapes and defaults only, no logic.
import type { MenuNode } from '../../domain/menuTree';

export interface SelectOption {
  value: string;
  label: string;
}

/** A row of the W2 `tipos-trabajador-perfil` catalog. */
export interface PerfilRow {
  id_tipo_perfil: string;
  descripcion: string;
  id_tipo_trabajador: string;
  tipo_trabajador?: string;
}

export interface PerfilNotice {
  title: string;
  message: string;
}

export interface InterUiSeguridadPerfil {
  title?: string;
  descriptionLabel?: string;
  tipoLabel?: string;
  tipoPlaceholder?: string;
  loadLabel?: string;
  permisosFormLabel?: string;
  saveLabel?: string;
  permisosLabel?: string;
  closeLabel?: string;
  /** Header of the tree before a perfil is loaded. */
  treeHeader?: string;
  /** The perfiles that pass both filters. */
  rows: PerfilRow[];
  selectedId?: string;
  descripcion: string;
  tipoTrabajador: string;
  tipoOptions: SelectOption[];
  status: 'loading' | 'ready' | 'failed';
  loadError?: string;
  /** Descripcion of the perfil whose tree is loaded; empty until `Perfil` loads one. */
  treeTitle: string;
  nodes: MenuNode[];
  /** Node id -> its checkbox as currently edited. */
  checked: Record<number, boolean>;
  selectedNode?: number;
  /** A perfil tree is loaded: `Guardar` and `Permisos` are enabled. */
  treeLoaded: boolean;
  saving: boolean;
  notice?: PerfilNotice;
  /** Callbacks are value-first. */
  onDescripcionChange: (value: string) => void;
  onTipoChange: (value: string) => void;
  onSelectRow: (id: string) => void;
  onLoadTree: () => void;
  onToggleNode: (id: number, checked: boolean) => void;
  onSelectNode: (id: number) => void;
  onSave: () => void;
  onCloseNotice: () => void;
}

/** Presentation defaults only; selections, filters and checks are state and never defaulted. Labels are the desktop's, verbatim. */
export const UISEGURIDADPERFIL_DEFAULTS: Required<
  Pick<InterUiSeguridadPerfil, 'title' | 'descriptionLabel' | 'tipoLabel' | 'tipoPlaceholder' | 'loadLabel' | 'permisosFormLabel' | 'saveLabel' | 'permisosLabel' | 'closeLabel' | 'treeHeader'>
> = {
  title: 'Seguridad - Perfil',
  descriptionLabel: 'Desc.',
  tipoLabel: 'T Trabajador',
  tipoPlaceholder: '--- Seleccione---',
  loadLabel: 'Perfil',
  permisosFormLabel: 'Permisos de Formulario',
  saveLabel: 'Guardar',
  permisosLabel: 'Permisos',
  closeLabel: 'Aceptar',
  treeHeader: 'Perfil',
};
