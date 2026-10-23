import { referenceCatalog } from './reference.js';

/**
 * One amount of the Tipo de Cambio (`DoubleDocument`: no precision limit, so `scale` only marks it as a decimal). Blank, zero or
 * negative all say "especificar su ..." with a stray space before the comma, as `RegisterTipoCambio.isRegisterValid` spells it.
 * @param {string} name @param {string} label @param {string} phrase the desktop wording after "su"
 */
const monto = (name, label, phrase) => ({
  name, kind: 'number', label, required: true, scale: 3, exclusiveMin: 0, default: '0.0', blankToDefault: true,
  message: `Para {modo} un Tipo de Cambio , debes especificar su ${phrase}.`,
});

const DATE_MESSAGE = 'La fecha del Tipo de Cambio que has especificado no es válida. Compruébala e inténtalo de nuevo.';

/**
 * Tipo de Cambio (`RegisterTipoCambio`, `UiRegisterTipoCambioImpl`). Checked in the desktop order: the date (an empty or
 * invalid one says so first), the moneda, the duplicate, then the four amounts, so the amounts are only reported by the
 * server after a passing duplicate check (D10). `mantTipoCambio` passes the session user and empresa on every write, but
 * `DaoTipoCambio.listTipoCambio(id, fecha, moneda)` takes no empresa, so the list stays tenant-wide: stamp only.
 * The Moneda combo is always disabled and starts on DOLAR AMERICANO; a CLONE starts today. [DEVIATION] the desktop duplicate
 * check ignores the moneda although its message names it, the web port keys uniqueness on (empresa, fecha, moneda); the
 * desktop moneda and Monto Especial messages name "Familia" and "Monto Comercial", the web port names the real field. The
 * nested "nueva moneda" button is excluded (R-REF-12, S-REF-39).
 */
export const tiposCambio = referenceCatalog({
  slug: 'tipos-cambio', idKey: 'id_tipo_cambio', entity: 'un Tipo de Cambio', formId: 'miTipoCambio', title: 'Tipo de Cambio', stamp: ['id_usuario', 'id_empresa'], descripcion: false,
  fields: [
    // `today` for INSERT and CLONE: a per-mode default overrides the cloned date (R-CRUD-15).
    { name: 'fecha', kind: 'date', label: 'Fecha', required: true, default: { INSERT: 'today', CLONE: 'today' }, message: DATE_MESSAGE, messages: { date: DATE_MESSAGE } },
    // 00004 is DOLAR AMERICANO (a seed spec asserts it); the select is read-only in every mode.
    { name: 'id_moneda', kind: 'select', label: 'Moneda', required: true, source: { catalog: 'monedas' }, default: '00004', readOnlyOn: ['INSERT', 'UPDATE', 'CLONE', 'DETAIL', 'DELETE'] },
    monto('monto_compra', 'Monto de Compra', 'Monto de Compra'),
    monto('monto_venta', 'Monto de Venta', 'monto de Venta'),
    monto('monto_comercial', 'Monto Comercial', 'Monto Comercial'),
    monto('monto_especial', 'Monto Especial', 'Monto Especial'),
  ],
  columns: [
    { key: 'fecha', header: 'Fecha', type: 'date' }, { key: 'moneda', header: 'Moneda' },
    { key: 'monto_compra', header: 'M. Compra', type: 'dec' }, { key: 'monto_venta', header: 'M. Venta', type: 'dec' },
    { key: 'monto_comercial', header: 'M. Comercial', type: 'dec' }, { key: 'monto_especial', header: 'M. Especial', type: 'dec' },
  ],
  joins: [{ as: 'moneda', ref: 'id_moneda', display: 'descripcion' }],
  unique: [{
    fields: ['fecha', 'id_moneda'], includeEmpresa: true, errorField: 'fecha',
    message: 'La fecha del Tipo Cambio ya se encuentra registrado para esa moneda, por favor ingrese otra fecha o seleccione otra moneda.',
  }],
  validation: ['fecha', 'id_moneda', { unique: 0 }, 'monto_compra', 'monto_venta', 'monto_comercial', 'monto_especial'],
});
