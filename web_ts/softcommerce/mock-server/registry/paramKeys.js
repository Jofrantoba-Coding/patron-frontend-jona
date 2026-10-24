/**
 * The closed set of company-parameter keys `GET /v1/params` serves (R-MOCK-24) and the type of each value. A `gate.param` (R-REG-17) must be a
 * `boolean` key; `PORC_IGV` is a number and `INICIO_ACTIVIDADES` a date, so they are value sources (`$params.X`, D27b), never gates (D25).
 * A test compares this list with the seeded `params.json` payloads so the two cannot drift.
 * @type {Record<string, 'boolean' | 'number' | 'date'>}
 */
export const PARAM_KEYS = {
  INICIO_ACTIVIDADES: 'date',
  IS_FACTURADOR_SUNAT: 'boolean',
  ISBOTICA: 'boolean',
  DESPACHO_AUTOMATICO: 'boolean',
  IS_CLIENTE_SUSTITUTO: 'boolean',
  IS_CLIENTE_CREDITO: 'boolean',
  IS_CLIENTE_CONDICION_PAGO: 'boolean',
  IS_DIRECCION_CLIENTE: 'boolean',
  IS_ITEM_RESUMEN_PRECIO: 'boolean',
  IS_BOTICA_SIN_LOTE: 'boolean',
  PORC_IGV: 'number',
};

/** Whether `key` may be a `gate.param`: a params key holding a boolean. @param {string} key */
export const isGateParam = (key) => Object.hasOwn(PARAM_KEYS, key) && PARAM_KEYS[key] === 'boolean';
