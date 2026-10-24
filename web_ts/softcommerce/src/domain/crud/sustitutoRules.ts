// Pure: the client rules of the Cliente sustitutos Activar and Desactivar (R-MST-12, `RegisterClienteNuevo.activarSustituto` / `desactivarSustituto`). The grid row carries the state of its
// cliente in `estado_cliente` (the joined estado, `'false'` once the cliente is deactivated; a pending row copies it from the picked cliente).
import type { ActionCall, ActionRule } from './actionRules';

const NINGUNO = 'Seleccionar un Elemento.';
const clienteDesactivado = (selected: NonNullable<ActionCall['selected']>) => ['false', 'D'].includes(String(selected.estado_cliente));

export const SUSTITUTO_RULES: Record<string, ActionRule> = {
  /** Activar. An empty grid does nothing; the row decides next: already active, then its cliente deactivated; the question `Desea activar Cliente Sustituto?` comes after. */
  activarSustituto: {
    check: ({ rows, selected }) => {
      if (rows.length === 0) return '';
      if (!selected) return NINGUNO;
      if (selected.estado === 'A') return 'Sustituto ya esta activado';
      return clienteDesactivado(selected) ? 'Cliente esta desactivado' : undefined;
    },
    apply: () => ({ change: { estado: 'A' } }),
  },
  /** Desactivar. A pending row is dropped (the desktop `deleteClienteSustituto`); a persisted one is deactivated (estado `D`, operacion `A`). */
  desactivarSustituto: {
    check: ({ rows, selected }) => {
      if (rows.length === 0) return '';
      if (!selected) return NINGUNO;
      return selected.estado === 'D' ? 'Sustituto ya esta desactivado' : undefined;
    },
    apply: ({ selected }) => (String(selected?._key).startsWith('~') ? { remove: true } : { change: { estado: 'D' } }),
  },
};
