import { todayIso } from './dates.js';

/**
 * The named rule `fechaAutorizacion` (R-PRM-7, D14): `fecha_inicio` and `fecha_fin` of a usuario-correlativos row are server-managed. Neither screen writes them
 * (they are stored-only columns, not fields, and the rule owns them); the rule keeps the stored dates and gives a row with no start the day it is first written
 * (the W2 screen creates an authorization on that day). Autorizar Series sets them through its actions. Pure: both mocks share it.
 */
export const fechaAutorizacion = {
  /** @returns {string[]} */
  owns: () => ['fecha_inicio', 'fecha_fin'],

  /** @param {Record<string, unknown>} values */
  derive: (values) => ({ fecha_inicio: String(values.fecha_inicio ?? '') || todayIso(), fecha_fin: String(values.fecha_fin ?? '') }),
};
