import { referenceCatalog } from './reference.js';

/**
 * Familia (`RegisterFamilia`): empresa scope (list and every write take the session empresa), the optional Codigo Sunat
 * select over familias-sunat, and a code padded to three (`PanelTFFamilia`). The desktop never sets the user on the bean,
 * so nothing but the empresa is stamped.
 */
export const familias = referenceCatalog({
  slug: 'familias', idKey: 'id_familia', entity: 'una Familia', formId: 'miFamilia', title: 'Familia', scope: 'empresa', stamp: [],
  fields: [{ name: 'id_familia_sunat', kind: 'select', label: 'Codigo Sunat', source: { catalog: 'familias-sunat' } }],
  columns: [{ key: 'id_familia_sunat', header: 'Código Sunat' }, { key: 'familia_sunat', header: 'Familia Sunat' }],
  joins: [{ as: 'familia_sunat', ref: 'id_familia_sunat', display: 'descripcion' }],
});
