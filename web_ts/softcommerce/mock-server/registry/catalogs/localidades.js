/**
 * Localidad (`RegisterLocalidad`), migrated from the W1 hand-written rules. The
 * `compat` block keeps the W1 behavior byte for byte: W1 message text, all field
 * errors in one 422, and a server that never required `direccion`.
 * @type {import('../schema.js').CatalogDef}
 */
export const localidades = {
  slug: 'localidades',
  idKey: 'id_localidad',
  codeWidth: 0,
  entity: 'una localidad',
  scope: 'tenant',
  // W1 section, seeded by the W1 loader (`data/localidades.json`).
  seed: null,
  formId: 'mi_localidad',
  title: 'Localidad',
  messages: { style: 'w1' },
  compat: { messages: 'w1', serverOptional: ['direccion'] },
  validation: ['id_empresa', 'descripcion', 'id_ubigeo', 'direccion'],
  fields: [
    { name: 'id_empresa', kind: 'select', label: 'Empresa', required: true, source: { catalog: 'empresas' } },
    { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 100, normalize: ['upper'] },
    { name: 'direccion', kind: 'text', label: 'Dirección', required: true, max: 100, normalize: ['upper'] },
    // The UI renders this select as the departamento > provincia > distrito cascade.
    { name: 'id_ubigeo', kind: 'select', label: 'Distrito', required: true, source: { catalog: 'ubigeo' } },
  ],
  columns: [
    { key: 'descripcion', header: 'Descripción' },
    { key: 'direccion', header: 'Dirección' },
    { key: 'empresa', header: 'Empresa' },
    { key: 'departamento', header: 'Departamento' },
    { key: 'provincia', header: 'Provincia' },
    { key: 'distrito', header: 'Distrito' },
  ],
  joins: [
    { as: 'empresa', ref: 'id_empresa', display: 'name' },
    // INEI codes nest by prefix: departamento 2 digits, provincia 4, distrito 6.
    { as: 'departamento', ref: 'id_ubigeo', display: 'name', prefixLen: 2 },
    { as: 'provincia', ref: 'id_ubigeo', display: 'name', prefixLen: 4 },
    { as: 'distrito', ref: 'id_ubigeo', display: 'name', prefixLen: 6 },
  ],
};
