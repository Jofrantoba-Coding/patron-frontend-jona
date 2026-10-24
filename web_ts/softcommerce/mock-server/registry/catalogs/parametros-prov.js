/**
 * Parámetro de provisión (`BeanParametroProv`, R-MOCK-25, D21): the read-only list behind the BuscarParametroProv picker (W4 RegisterNotaDebito). The shape
 * `{ id_parametro_prov, descripcion, id_cuenta, cuenta, tipo, flag_compra, flag_venta, flag_tesoreria, flag_fondo_fijo }` is [INFERRED]: the meaning of `tipo` `C`
 * and of the `S`/`N` flags is not in the repository, so they are data. The picker lists the rows of tipo `C`. Per tenant, no screen, no menu node.
 * @type {import('../schema.js').CatalogDef}
 */
export const parametrosProv = {
  slug: 'parametros-prov',
  idKey: 'id_parametro_prov',
  codeWidth: 0,
  entity: 'un Parametro de Provision',
  scope: 'tenant',
  seed: 'parametros-prov',
  readOnly: true,
  optionLabel: 'descripcion',
  search: ['id_parametro_prov', 'descripcion'],
  messages: { style: 'M1' },
  fields: [
    { name: 'id_parametro_prov', kind: 'code', label: 'Código' },
    { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 255 },
    { name: 'id_cuenta', kind: 'text', label: 'Id cuenta', max: 20 },
    { name: 'cuenta', kind: 'text', label: 'Cuenta', max: 20 },
    { name: 'tipo', kind: 'text', label: 'Tipo', max: 1 },
    { name: 'flag_compra', kind: 'text', label: 'Compra', max: 1 },
    { name: 'flag_venta', kind: 'text', label: 'Venta', max: 1 },
    { name: 'flag_tesoreria', kind: 'text', label: 'Tesorería', max: 1 },
    { name: 'flag_fondo_fijo', kind: 'text', label: 'Fondo fijo', max: 1 },
  ],
  columns: [{ key: 'id_parametro_prov', header: 'Código' }, { key: 'descripcion', header: 'Descripción' }, { key: 'cuenta', header: 'Cuenta' }],
};
