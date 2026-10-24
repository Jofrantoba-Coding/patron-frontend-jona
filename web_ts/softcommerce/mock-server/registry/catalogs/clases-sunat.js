/**
 * Clase SUNAT (R-MOCK-25, D21): the read-only list behind the Item `Codigo Sunat` (W3-18). Its options depend on the SUNAT code of the chosen subfamilia, so
 * `codigo_subfamilia_sunat` is an exact filter key. The shape `{ id_clase_sunat, descripcion, codigo_subfamilia_sunat }` is [INFERRED]; the real data and the
 * final scope belong to W6. Global data (`shared`), no screen, no menu node.
 * @type {import('../schema.js').CatalogDef}
 */
export const clasesSunat = {
  slug: 'clases-sunat',
  idKey: 'id_clase_sunat',
  codeWidth: 0,
  entity: 'una Clase SUNAT',
  scope: 'shared',
  seed: 'clases-sunat',
  readOnly: true,
  optionLabel: 'descripcion',
  search: ['id_clase_sunat', 'descripcion'],
  lookupFilters: { codigo_subfamilia_sunat: {} },
  messages: { style: 'M1' },
  fields: [
    { name: 'id_clase_sunat', kind: 'code', label: 'Código' },
    { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 255 },
    { name: 'codigo_subfamilia_sunat', kind: 'text', label: 'Subfamilia SUNAT', max: 20 },
  ],
  columns: [{ key: 'id_clase_sunat', header: 'Código' }, { key: 'descripcion', header: 'Descripción' }],
};
