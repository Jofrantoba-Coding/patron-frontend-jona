import { referenceCatalog } from './reference.js';

/** Tipo de Trabajador (`RegisterTipoTrabajador`): style M2, `abreviatura` up to 5 labelled Abrev, and the shared `estado`. */
export const tiposTrabajador = referenceCatalog({
  slug: 'tipos-trabajador', idKey: 'id_tipo_trabajador', entity: 'un Tipo Trabajador', formId: 'miTipoTrabajador', title: 'Tipo Trabajador',
  style: 'M2',
  fields: [
    { name: 'abreviatura', kind: 'text', label: 'Abrev', required: true, max: 5, normalize: ['upper'] },
    { name: 'estado', preset: 'estado' },
  ],
  columns: [{ key: 'abreviatura', header: 'Abreviatura' }, { key: 'estado', header: 'Estado', type: 'bool' }],
});
