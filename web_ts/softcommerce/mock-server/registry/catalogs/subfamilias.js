import { referenceCatalog } from './reference.js';

/**
 * SubFamilia (`RegisterSubFamilia`): the Familia is checked first, then the descripcion, and the optional Codigo Sunat
 * select depends on the chosen Familia: its options are the SUNAT rows of that familia's own SUNAT code (`via`, 6.4).
 * `DAOSubFamilia.mantSubFamilia` passes the session empresa on every write but `listar` passes '' for it, and the bean never
 * carries the user (`getIdUsuario` is never set), so the empresa is only stamped and the list stays tenant-wide (5.6b).
 * The desktop descripcion message has a stray space before its comma; it is kept as written. The nested "nueva familia"
 * button is excluded (R-REF-12). Code padded to three (`PanelTFSubFamilia`).
 */
export const subfamilias = referenceCatalog({
  slug: 'subfamilias', idKey: 'id_sub_familia', entity: 'una SubFamilia', formId: 'miSubFamilia', title: 'Sub-Familia', stamp: ['id_empresa'],
  descripcion: false,
  fields: [
    { name: 'id_familia', kind: 'select', label: 'Familia', required: true, source: { catalog: 'familias' } },
    { name: 'descripcion', preset: 'descripcion', normalize: ['upper'], message: 'Para {modo} una SubFamilia , debes especificar su Descripcion.' },
    { name: 'id_subfamilia_sunat', kind: 'select', label: 'Codigo Sunat', source: { catalog: 'subfamilias-sunat' }, dependsOn: [{ field: 'id_familia', filterKey: 'id_familia' }] },
  ],
  columns: [{ key: 'familia', header: 'Familia' }, { key: 'descripcion', header: 'Descripción' }, { key: 'subfamilia_sunat', header: 'Sunat' }],
  joins: [{ as: 'familia', ref: 'id_familia', display: 'descripcion' }, { as: 'subfamilia_sunat', ref: 'id_subfamilia_sunat', display: 'descripcion' }],
});
