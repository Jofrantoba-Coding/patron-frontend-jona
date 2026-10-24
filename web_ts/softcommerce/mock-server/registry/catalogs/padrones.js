/**
 * Padrón (R-MOCK-25, R-ANX-7, D21): the read-only list of the four padrones an anexo may carry, `01` EXCEPTUADO, `02` AG. RETENCION, `03` AG. PERCEPCION and
 * `04` BUEN CONTRIBUYENTE. The shape `{ id_padron, descripcion }` is [INFERRED]; the final scope belongs to W6. Global data (`shared`), no screen, no menu node.
 * @type {import('../schema.js').CatalogDef}
 */
export const padrones = {
  slug: 'padrones',
  idKey: 'id_padron',
  codeWidth: 2,
  entity: 'un Padron',
  scope: 'shared',
  seed: 'padrones',
  readOnly: true,
  optionLabel: 'descripcion',
  search: ['id_padron', 'descripcion'],
  messages: { style: 'M1' },
  fields: [
    { name: 'id_padron', kind: 'code', label: 'Código' },
    { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 100 },
  ],
  columns: [{ key: 'id_padron', header: 'Código' }, { key: 'descripcion', header: 'Descripción' }],
};
