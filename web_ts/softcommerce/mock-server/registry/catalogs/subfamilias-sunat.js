/**
 * Subfamilia SUNAT (`DAOSubFamilia.listarSubFamiliaSunat`, R-MOCK-15): the read-only list behind the optional "Codigo Sunat"
 * select of a Subfamilia. The desktop loads it for the SUNAT code of the chosen Familia (`BeanFamilia.getCodigoFamiliaSunat`)
 * and shows the description with the code as the value, so the code is the id. The Familia is chosen by its own id, so the
 * options endpoint resolves it server-side (`via`): `?id_familia=` selects the rows whose `codigo_familia` equals the SUNAT code
 * that familia holds. Global data (`shared`, W6 to confirm), no screen, no menu node.
 * @type {import('../schema.js').CatalogDef}
 */
export const subfamiliasSunat = {
  slug: 'subfamilias-sunat',
  idKey: 'id_subfamilia_sunat',
  // The SUNAT codes are fixed by the tax authority, never issued by the server.
  codeWidth: 0,
  entity: 'una Subfamilia Sunat',
  scope: 'shared',
  seed: 'subfamilias-sunat',
  readOnly: true,
  messages: { style: 'M1' },
  fields: [
    { name: 'id_subfamilia_sunat', kind: 'code', label: 'Código' },
    { name: 'descripcion', kind: 'text', label: 'Descripción', required: true, max: 100 },
    { name: 'codigo_familia', kind: 'text', label: 'Código Familia', max: 10 },
  ],
  columns: [{ key: 'id_subfamilia_sunat', header: 'Código' }, { key: 'descripcion', header: 'Descripción' }, { key: 'codigo_familia', header: 'Código Familia' }],
  lookupFilters: { id_familia: { via: { catalog: 'familias', key: 'id_familia_sunat', as: 'codigo_familia' } } },
};
