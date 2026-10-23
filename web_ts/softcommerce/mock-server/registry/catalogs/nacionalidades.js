import { referenceCatalog } from './reference.js';

/** Nacionalidad (`RegisterNacionalidad`); the seed keeps PERUANA and EXTRANJERA for the docIdentidad rule (W2-12). */
export const nacionalidades = referenceCatalog({
  slug: 'nacionalidades', idKey: 'id_nacionalidad', entity: 'una Nacionalidad', formId: 'miNacionalidad', title: 'Nacionalidad',
});
