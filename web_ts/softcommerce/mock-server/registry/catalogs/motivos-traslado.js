import { referenceCatalog } from './reference.js';

/**
 * Motivo Traslado (`RegisterMotivoTraslado`): `abrev` is optional and `hab_guia` is a checkbox that the desktop
 * stores as S/N. [DEVIATION] the desktop message says "una Tipo Anexo"; the web port names the Motivo Traslado.
 */
export const motivosTraslado = referenceCatalog({
  slug: 'motivos-traslado', idKey: 'id_motivo_traslado', entity: 'un Motivo Traslado', formId: 'miMotivoTraslado', title: 'Motivo Traslado',
  fields: [
    { name: 'abrev', kind: 'text', label: 'Abreviatura', max: 100, normalize: ['upper'] },
    { name: 'hab_guia', kind: 'boolean', label: 'Hab Guia', default: false },
  ],
  columns: [{ key: 'abrev', header: 'Abreviatura' }, { key: 'hab_guia', header: 'Hab Guia', type: 'bool' }],
});
