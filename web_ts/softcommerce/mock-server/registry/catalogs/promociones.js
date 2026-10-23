import { referenceCatalog } from './reference.js';

/**
 * Promoción (`RegisterPromocion`): only the descripcion is validated. Both dates start today and carry no range, blank or
 * not-future rule (the generic date rules of S-CRUD-28 stay unused), and the `estado` preset is the "Activo" checkbox
 * (true and read-only on INSERT). `DaoPromocion` passes neither the user nor the empresa, so nothing is stamped; the id is an int.
 */
export const promociones = referenceCatalog({
  slug: 'promociones', idKey: 'id_promocion', entity: 'una Promocion', formId: 'miPromocion', title: 'Promocion', codeWidth: 0, stamp: [],
  fields: [
    { name: 'fecha_ini', kind: 'date', label: 'Fecha Ini', default: 'today' },
    { name: 'fecha_fin', kind: 'date', label: 'Fecha Fin', default: 'today' },
    { name: 'estado', preset: 'estado' },
  ],
  columns: [{ key: 'fecha_ini', header: 'Fecha Ini', type: 'date' }, { key: 'fecha_fin', header: 'Fecha Fin', type: 'date' }, { key: 'estado', header: 'Estado', type: 'bool' }],
});
