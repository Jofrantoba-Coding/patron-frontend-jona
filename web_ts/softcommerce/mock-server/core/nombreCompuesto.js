/**
 * The named rule `nombreCompuesto` (D9, R-MST-4): the display name of a person is composed from its parts and never typed. `RegisterTrabajador.getBeanTrabajador`
 * sets `nombre = paterno + " " + materno + " " + nombres` (each part trimmed), so the lookup shows `PEREZ LOPEZ ANA`. The rule hides the composed field from
 * the register, owns it (a body never writes it) and derives it on every write. Params name the columns: `target` (default `nombre`) and `parts`
 * (default `ap_paterno`, `ap_materno`, `nombres`). Pure: the UI and both mocks share it.
 */

/** @param {Record<string, unknown> | undefined} params */
const columns = (params) => ({ target: String(params?.target ?? 'nombre'), parts: /** @type {string[]} */ (params?.parts ?? ['ap_paterno', 'ap_materno', 'nombres']) });

export const nombreCompuesto = {
  /** @param {Record<string, unknown>} _values @param {Record<string, unknown>} [params] */
  state(_values, params) {
    return { [columns(params).target]: { hidden: true } };
  },

  /** @param {Record<string, unknown>} [params] */
  owns: (params) => [columns(params).target],

  /** @param {Record<string, unknown>} values @param {Record<string, unknown>} [params] */
  derive(values, params) {
    const { target, parts } = columns(params);
    return { [target]: parts.map((name) => String(values[name] ?? '').trim()).join(' ') };
  },
};
