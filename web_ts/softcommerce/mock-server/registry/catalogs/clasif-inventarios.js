import { referenceCatalog } from './reference.js';

/**
 * Tipo de Movimiento de Inventario (`RegisterClasifInventario`): descripcion, abrev and a Entrada / Salida radio
 * that has no default. The string id has no pad evidence in the desktop; three digits are inferred (flagged for W6).
 */
export const clasifInventarios = referenceCatalog({
  slug: 'clasif-inventarios', idKey: 'id_clasif_inventario', entity: 'un Tipo de Movimiento de Inventario', formId: 'miClasifInventario',
  title: 'Tipo de Movimiento de Inventario',
  fields: [
    { name: 'abrev', kind: 'text', label: 'Abreviatura', required: true, max: 100, normalize: ['upper'] },
    {
      name: 'tipo', kind: 'options', label: 'Tipo de Movimiento', required: true, display: 'radio',
      options: [{ value: 'E', label: 'Entrada' }, { value: 'S', label: 'Salida' }],
    },
  ],
  columns: [{ key: 'abrev', header: 'Abreviatura' }, { key: 'tipo_label', header: 'Tipo de Movimiento' }],
});
