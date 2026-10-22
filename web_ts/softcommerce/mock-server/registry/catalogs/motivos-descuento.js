import { referenceCatalog } from './reference.js';

/**
 * Motivo de Descuento (`RegisterMotivoDescuento`): integer id (unpadded), `abrev` up to 5 and a required Tipo Dscto
 * over tipos-descuento. The desktop DAO passes no user, so nothing is stamped. [DEVIATION] the desktop abrev message
 * says "Descripcion" and the tipo message is empty; the web port words "Abrev" and "Tipo Dscto".
 */
export const motivosDescuento = referenceCatalog({
  slug: 'motivos-descuento', idKey: 'id_motivo_descuento', entity: 'un Motivo Descuento', formId: 'miMotivoDescuento', title: 'Motivo Descuento',
  codeWidth: 0, stamp: [],
  fields: [
    { name: 'abrev', kind: 'text', label: 'Abrev', required: true, max: 5, normalize: ['upper'] },
    { name: 'id_tipo_descuento', kind: 'select', label: 'Tipo Dscto', required: true, source: { catalog: 'tipos-descuento' } },
  ],
  columns: [{ key: 'abrev', header: 'Abrev' }, { key: 'tipo_descuento', header: 'Tipo Dscto' }],
  joins: [{ as: 'tipo_descuento', ref: 'id_tipo_descuento', display: 'descripcion' }],
});
