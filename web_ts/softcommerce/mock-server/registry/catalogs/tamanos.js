import { referenceCatalog } from './reference.js';

/**
 * Tamano (`RegisterTamano`), empresa scope per R-REF-4: the insert passes the session empresa. The desktop list passes ''
 * (`listarGeneral` ignores its parameter), so the scope follows the spec rather than the list. [DEVIATION] the desktop
 * says "una Tamano"; the web port words the real gender.
 */
export const tamanos = referenceCatalog({ slug: 'tamanos', idKey: 'id_tamano', entity: 'un Tamano', formId: 'miTamano', title: 'Tamano', scope: 'empresa' });
