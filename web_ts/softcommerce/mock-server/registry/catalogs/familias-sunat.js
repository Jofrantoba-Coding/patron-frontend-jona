/**
 * Familia SUNAT (`DAOFamilia.listarFamiliaSunat`, R-MOCK-15): the read-only list behind the optional "Codigo Sunat"
 * select of a Familia. The desktop combo shows the description and keeps the SUNAT code as the value, so the code
 * is the id and the description the option name. Global data (`shared`, W6 to confirm), no screen, no menu node.
 * @type {import('../schema.js').CatalogDef}
 */
export const familiasSunat = {
  slug: 'familias-sunat',
  idKey: 'codigo',
  // The SUNAT codes are fixed by the tax authority, never issued by the server.
  codeWidth: 0,
  entity: 'una Familia Sunat',
  scope: 'shared',
  seed: 'familias-sunat',
  readOnly: true,
  messages: { style: 'M1' },
  fields: [
    { name: 'codigo', kind: 'code', label: 'Código' },
    { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 100 },
  ],
  columns: [{ key: 'codigo', header: 'Código' }, { key: 'descripcion', header: 'Descripción' }],
};
