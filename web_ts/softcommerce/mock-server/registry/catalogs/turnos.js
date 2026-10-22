import { referenceCatalog } from './reference.js';

/** `hora` and `minuto` of the Turno: two digits, padded on blur, with the range the desktop checks (`IntegerDocument(2)`, focusLost, isRegisterValid). */
/** @param {string} name @param {string} label @param {number} max */
const clock = (name, label, max) => ({
  name, kind: 'number', label, required: true, scale: 0, max: 2, normalize: ['digits', 'padLeft:2'], range: { min: 0, max },
  messages: { range: `Para {modo}, debes Insertar ${label} Correcto.` },
});

/**
 * Turno (`RegisterTurno`): no description, style M2, hora 0..12 and minuto 0..59 plus AM/PM (default AM) and the shared
 * `estado`. The desktop checks both blanks before the ranges, so the order is declared. Its DAO never passes the
 * user (no stamp); the id is an int, printed unpadded. The list shows hora, minuto and tipo (the desktop joins them as `hh:mm tipo`).
 */
export const turnos = referenceCatalog({
  slug: 'turnos', idKey: 'id_turno', entity: 'un Turno', formId: 'miTurno', title: 'Turno', codeWidth: 0, style: 'M2', stamp: [], descripcion: false,
  fields: [
    clock('hora', 'Hora', 12),
    clock('minuto', 'Minutos', 59),
    { name: 'tipo', kind: 'options', label: 'Tipo', required: true, display: 'select', default: 'AM', options: [{ value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }] },
    { name: 'estado', preset: 'estado' },
  ],
  columns: [{ key: 'hora', header: 'Hora' }, { key: 'minuto', header: 'Minutos' }, { key: 'tipo', header: 'Tipo' }, { key: 'estado', header: 'Estado', type: 'bool' }],
  validation: ['hora', 'minuto', { range: 'hora' }, { range: 'minuto' }, 'tipo', 'estado'],
});
