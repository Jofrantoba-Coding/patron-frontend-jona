import { referenceCatalog } from './reference.js';

/**
 * Perfil de Tipo de Trabajador (`RegisterTipoTrabajadorPerfil`): integer id, descripcion first, then a tipo trabajador
 * of estado A (the desktop combo lists `listarTipoTrabajador("", "A")`). [DEVIATION] the desktop messages say "una ," and
 * "Departamento"; the web port words the real entity and field.
 */
export const tiposTrabajadorPerfil = referenceCatalog({
  slug: 'tipos-trabajador-perfil', idKey: 'id_tipo_perfil', entity: 'un Perfil', formId: 'miTipoTrabajadorPerfil', title: 'Tipo Trabajador Perfil',
  codeWidth: 0,
  fields: [
    { name: 'id_tipo_trabajador', kind: 'select', label: 'Tipo Trabajador', required: true, source: { catalog: 'tipos-trabajador', where: { estado: true } } },
  ],
  columns: [{ key: 'tipo_trabajador', header: 'Tipo Trabajador' }],
  joins: [{ as: 'tipo_trabajador', ref: 'id_tipo_trabajador', display: 'descripcion' }],
});
