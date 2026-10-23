import { referenceCatalog } from './reference.js';

/**
 * Zona (`RegisterZona`, R-REF-6): descripcion, the departamento > provincia > distrito cascade and the estado preset (true and read-only
 * on INSERT, editable on UPDATE). `DAOZona.listar(0, "")` and `mantZona(zona, op)` see the user (`zona.getId_usuario`) and no empresa,
 * so only the user is stamped and the list is tenant-wide. The checks are descripcion first, then the cascade levels worded in the
 * MS style ("debes Seleccionar un Departamento / una Provincia / un Distrito"); [DEVIATION] the desktop distrito message says
 * "Almacen", the web port names the Distrito. The descripcion keeps the desktop M1 sentence as a literal, since the entry style is MS.
 * The id is an int bean (unpadded).
 */
export const zonas = referenceCatalog({
  slug: 'zonas', idKey: 'id_zona', entity: 'una Zona', formId: 'miZona', title: 'Zona', style: 'MS', codeWidth: 0,
  descripcion: { message: 'Para {modo} una Zona, debes especificar su Descripcion.' },
  fields: [
    // The departamento > provincia > distrito cascade storing the distrito.
    { name: 'id_ubigeo', kind: 'select', label: 'Distrito', required: true, source: { catalog: 'ubigeo' } },
    { name: 'estado', kind: 'boolean', preset: 'estado' },
  ],
  columns: [
    { key: 'departamento', header: 'Departamento' },
    { key: 'provincia', header: 'Provincia' },
    { key: 'distrito', header: 'Distrito' },
    { key: 'estado', header: 'Estado', type: 'bool' },
  ],
  joins: [
    // INEI codes nest by prefix: departamento 2 digits, provincia 4, distrito 6.
    { as: 'departamento', ref: 'id_ubigeo', display: 'name', prefixLen: 2 },
    { as: 'provincia', ref: 'id_ubigeo', display: 'name', prefixLen: 4 },
    { as: 'distrito', ref: 'id_ubigeo', display: 'name', prefixLen: 6 },
  ],
});
