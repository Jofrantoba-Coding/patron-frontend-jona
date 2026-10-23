import { fieldMessage } from './messages.js';

/**
 * The named rule `docIdentidad` (D9, R-REF-8): Chofer and Socio pick a tipo de documento de identidad and everything else follows from it.
 * Four pure hooks over the form values, shared by the UI and both mocks:
 *  - `state(values, params)`     per-field `{ hidden, disabled, required, max }` of the document fields;
 *  - `validate(values, params, { entry, mode })` the first failing check in the desktop order, as a `detail[]` (0 or 1 item);
 *  - `effect(values, changed, params)` what an edit of the number triggers: `{ patch, alert }`;
 *  - `derive(values, params)`    values computed from the others: the composed razon social and the persona flag.
 * The tipo is judged by its id: `01` is the DNI and `05` the RUC (`FormImportarAnexo`: 8 digits -> `01`, else `05`; `RegisterSocio` compares the id
 * with `"05"`), declared as params so a seed spec can tie them to their abreviaturas.
 */

/** Field names and tipo ids; a registry `rules` entry overrides any of them. `sexo` and `persona` are optional columns. */
export const DOC_DEFAULTS = {
  tipo: 'id_tipo_doc_iden', numero: 'numero_doc', paterno: 'ap_paterno', materno: 'ap_materno', nombres: 'nombres', razon: 'descripcion', dni: '01', ruc: '05',
};

/** The alert a RUC with a wrong first digit raises (`RegisterChofer.keyReleased`). */
export const RUC_ALERT = 'EL DOCUMENTO RUC EMPIEZA CON 1 Ó 2';
const DNI_TEXT = 'El número de DNI que has especificado no es válida. Compruébala e inténtalo de nuevo.';
const RUC_TEXT = 'El número de RUC que has especificado no es válida. Compruébala e inténtalo de nuevo.';
/** Length of each document number: DNI 8, RUC and any other tipo 11 (`IntegerDocument(8|11)`). */
export const DNI_LENGTH = 8;
export const RUC_LENGTH = 11;

/** @param {unknown} value */
const text = (value) => String(value ?? '');

/**
 * What the tipo and the first digit of the number make of the form: `none` (no tipo yet), `dni`, `ruc` and `other`, and whether the three names
 * are the input (`persona`: a DNI, or a RUC of a natural person) or the razon social is.
 * @param {Record<string, unknown>} values @param {any} p
 */
function modeOf(values, p) {
  const tipo = text(values[p.tipo]);
  const first = text(values[p.numero]).charAt(0);
  const kind = tipo === '' ? 'none' : tipo === p.dni ? 'dni' : tipo === p.ruc ? 'ruc' : 'other';
  return { kind, first, names: kind === 'dni' || (kind === 'ruc' && first === '1') };
}

/** @param {Record<string, unknown>} [params] @returns {typeof DOC_DEFAULTS & { sexo?: string, persona?: string }} */
const withDefaults = (params) => ({ ...DOC_DEFAULTS, ...(/** @type {any} */ (params)) });

/** The composed razon social: the three names joined by single spaces. */
const compose = (/** @type {Record<string, unknown>} */ values, /** @type {any} */ p) =>
  [p.paterno, p.materno, p.nombres].map((name) => text(values[name]).trim()).filter((part) => part !== '').join(' ');

export const docIdentidad = {
  /** @param {Record<string, unknown>} values @param {Record<string, unknown>} [params] */
  state(values, params) {
    const p = withDefaults(params);
    const { kind, names } = modeOf(values, p);
    const number = kind === 'dni' ? { max: DNI_LENGTH } : kind === 'none' ? { max: RUC_LENGTH, disabled: true } : { max: RUC_LENGTH };
    // The names are the input for a person, the razon social for everything else; before a tipo is chosen nothing can be typed.
    const person = (/** @type {Record<string, boolean>} */ names_) => ({ [p.paterno]: names_, [p.materno]: names_, [p.nombres]: names_ });
    const state = {
      [p.numero]: number,
      ...(kind === 'none' ? { ...person({ disabled: true }), [p.razon]: { disabled: true } } : names ? { ...person({ required: true }), [p.razon]: { hidden: true } } : { ...person({ disabled: true }), [p.razon]: { required: true } }),
    };
    // Sex belongs to a natural person only (`panelSexo` is visible for a DNI and a RUC starting with 1).
    return p.sexo === undefined ? state : { ...state, [p.sexo]: kind === 'none' || names ? {} : { hidden: true } };
  },

  /**
   * The first failing check, in the desktop order: the number length (`DNI` < 8, `RUC` < 11), then, for a RUC, the first digit, then the three names
   * when they are the input. The razon social is an ordinary required field after this step. A RUC that starts with neither 1 nor 2 is cleared by
   * `effect` on the form, so the server rejects it with the same text.
   * @param {Record<string, unknown>} values @param {Record<string, unknown> | undefined} params @param {{ entry: any, mode?: string }} context
   * @returns {{ field: string, code: string, message: string }[]}
   */
  validate(values, params, { entry, mode = 'INSERT' }) {
    const p = withDefaults(params);
    const { kind, first, names } = modeOf(values, p);
    const number = text(values[p.numero]).trim();
    if (kind === 'dni' && number.length < DNI_LENGTH) return [{ field: p.numero, code: 'MIN_LENGTH', message: DNI_TEXT }];
    if (kind === 'ruc' && number.length < RUC_LENGTH) return [{ field: p.numero, code: 'MIN_LENGTH', message: RUC_TEXT }];
    if (kind === 'ruc' && first !== '1' && first !== '2') return [{ field: p.numero, code: 'INVALID', message: RUC_ALERT }];
    if (!names) return [];
    for (const name of [p.paterno, p.materno, p.nombres]) {
      if (text(values[name]).trim() === '') {
        const field = entry.fields.find((/** @type {any} */ f) => f.name === name);
        return [{ field: name, code: 'REQUIRED', message: fieldMessage(entry, field, 'REQUIRED', /** @type {any} */ (mode)) }];
      }
    }
    return [];
  },

  /**
   * A RUC number whose first digit is neither 1 nor 2 raises the alert and is cleared (the desktop checks on length 1 and 11; here on every edit,
   * which also catches a pasted number). Only an edit of the number triggers it.
   * @param {Record<string, unknown>} values @param {string} changed @param {Record<string, unknown>} [params]
   * @returns {{ patch?: Record<string, string>, alert?: string }}
   */
  effect(values, changed, params) {
    const p = withDefaults(params);
    const { kind, first } = modeOf(values, p);
    if (changed !== p.numero || kind !== 'ruc' || first === '' || first === '1' || first === '2') return {};
    return { patch: { [p.numero]: '' }, alert: RUC_ALERT };
  },

  /**
   * The razon social composed from the names while they are the input, and the persona flag when the rule names a column for it
   * (`J` for a RUC starting with 2, `N` otherwise).
   * @param {Record<string, unknown>} values @param {Record<string, unknown>} [params]
   * @returns {Record<string, string>}
   */
  derive(values, params) {
    const p = withDefaults(params);
    const { kind, first, names } = modeOf(values, p);
    return {
      ...(names ? { [p.razon]: compose(values, p) } : {}),
      ...(p.persona === undefined ? {} : { [p.persona]: kind === 'ruc' && first === '2' ? 'J' : 'N' }),
    };
  },
};
