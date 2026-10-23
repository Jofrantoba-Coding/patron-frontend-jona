import { referenceCatalog } from './reference.js';

/**
 * Tipo Descuento (`RegisterTipoDescuento`): integer id (unpadded) and a required `abrev` of at most 5.
 * [DEVIATION] the desktop abrev message says "Descripcion"; the web port says "Abrev".
 */
export const tiposDescuento = referenceCatalog({
  slug: 'tipos-descuento', idKey: 'id_tipo_descuento', entity: 'un Tipo Descuento', formId: 'miTipoDescuento', title: 'Tipo Descuento',
  codeWidth: 0,
  fields: [{ name: 'abrev', kind: 'text', label: 'Abrev', required: true, max: 5, normalize: ['upper'] }],
  columns: [{ key: 'abrev', header: 'Abrev' }],
});
