// Pure: the client rules of the anexo Activar and Desactivar (R-ANX-3, R-ANX-4, D13). The entity word of the messages comes from the action `params`.
import { FECHA_MENOR } from '../../../mock-server/core/activacionRule.js';
import type { ActionCall, ActionRule } from './actionRules';

type Row = Record<string, any>;
const entityOf = (call: ActionCall) => String(call.params.entity);
/** A row the open register has changed or added and the server does not know yet: a pending insert (`~`) or a persisted row with a pending op. */
const hasPending = (row: Row) => String(row._key).startsWith('~') || row._changed === true;

export const ANEXO_RULES: Record<string, ActionRule> = {
  /** Activar. Like the desktop it looks at the LAST row only: active gives `ya Esta Activado`, a deactivation made in this register `recien lo acaba de Desactivar`. */
  activarAnexo: {
    check: ({ rows, ...call }) => {
      const last = rows.at(-1);
      if (!last) return undefined;
      if (last.estado !== 'D') return `${entityOf({ rows, ...call })} ya Esta Activado`;
      return hasPending(last) ? `${entityOf({ rows, ...call })} recien lo acaba de Desactivar` : undefined;
    },
    apply: ({ input }) => ({ insert: { f_inicio: input.f_inicio, motivo_activacion: input.motivo_activacion }, parent: { estado: 'true' } }),
  },
  /** Desactivar. An empty grid does nothing (the empty text refuses silently), then the selected row decides; the fecha fin cannot precede the start. */
  desactivarAnexo: {
    check: (call) => {
      if (call.rows.length === 0) return '';
      if (!call.selected) return 'Seleccione un Registro';
      if (call.selected.estado === 'D') return 'Registro ya esta Desactivado';
      return hasPending(call.selected) ? `${entityOf(call)} recien lo acaba de Activar` : undefined;
    },
    guard: ({ selected, input }) => (selected && input.f_fin && String(input.f_fin) < String(selected.f_inicio) ? FECHA_MENOR : undefined),
    apply: ({ input }) => ({ change: { patch: { f_fin: input.f_fin, motivo_desactivacion: input.motivo_desactivacion }, estado: 'D' }, parent: { estado: 'false' } }),
  },
};
