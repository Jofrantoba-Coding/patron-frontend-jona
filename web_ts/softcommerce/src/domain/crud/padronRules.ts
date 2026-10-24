// Pure: the client rules of the padron Activar and Desactivar (R-ANX-7, R-ANX-8, W3-15). The master flags come from the action `params.flags` (padron id -> field).
import { todayIso } from '../../../mock-server/core/dates.js';
import { PADRON_REQUERIDO, refusal } from '../../../mock-server/core/padronRule.js';
import type { ActionCall, ActionRule } from './actionRules';

const flagOf = (call: ActionCall, idPadron: unknown) => (call.params.flags as Record<string, string> | undefined)?.[String(idPadron)];
/** The master flag of a padron id set to `value`, when that master has one for it. */
const parentFlag = (call: ActionCall, idPadron: unknown, value: 'true' | 'false') => {
  const flag = flagOf(call, idPadron);
  return flag ? { parent: { [flag]: value } } : {};
};

export const PADRON_RULES: Record<string, ActionRule> = {
  /** Activar. `Agregar Padron` opens at once; the incompatibility check of `verificarPadron` runs when it is confirmed (it needs the padron chosen in it). */
  activarPadron: {
    guard: ({ rows, input }) => (input.id_padron ? refusal(rows, String(input.id_padron)) : PADRON_REQUERIDO),
    apply: (call) => ({ insert: { id_padron: call.input.id_padron, f_inicio: call.input.f_inicio }, ...parentFlag(call, call.input.id_padron, 'true') }),
  },
  /** Desactivar. An empty grid does nothing, then the selected row decides; the confirmation `Desea Desactivar Padron?` comes after. */
  desactivarPadron: {
    check: ({ rows, selected }) => {
      if (rows.length === 0) return '';
      if (!selected) return 'Seleccionar Fila';
      return selected.estado === 'D' ? 'Padron Seleccionado ya esta desactivado' : undefined;
    },
    apply: (call) => {
      const selected = call.selected as Record<string, any>;
      const parent = parentFlag(call, selected.id_padron, 'false');
      // A row nobody saved yet has nothing to close: it leaves the grid, so the register sends neither the activation nor its deactivation.
      return String(selected._key).startsWith('~') ? { remove: true, ...parent } : { change: { patch: { f_fin: todayIso() }, estado: 'D' }, ...parent };
    },
  },
};
