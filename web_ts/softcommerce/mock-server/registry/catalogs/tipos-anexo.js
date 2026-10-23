import { referenceCatalog } from './reference.js';

/** Tipo Anexo (`RegisterTipoAnexo`): `abreviatura` is optional. [DEVIATION] the desktop says "una Tipo Anexo". */
export const tiposAnexo = referenceCatalog({
  slug: 'tipos-anexo', idKey: 'id_tipo_anexo', entity: 'un Tipo Anexo', formId: 'miTipoAnexo', title: 'Tipo Anexo',
  fields: [{ name: 'abreviatura', kind: 'text', label: 'Abreviatura', max: 100, normalize: ['upper'] }],
  columns: [{ key: 'abreviatura', header: 'Abreviatura' }],
});
