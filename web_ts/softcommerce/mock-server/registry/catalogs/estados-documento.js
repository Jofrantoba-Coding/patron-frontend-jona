import { referenceCatalog } from './reference.js';

/** Estado de Documento (`RegisterEstadoDocumento`); the dialog is titled "Estado del Documento". */
export const estadosDocumento = referenceCatalog({
  slug: 'estados-documento', idKey: 'id_estado_documento', entity: 'un Estado de Documento', formId: 'miEstadoDocumento', title: 'Estado del Documento',
});
