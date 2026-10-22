import { referenceCatalog } from './reference.js';

/**
 * Tamano (`RegisterTamano`): the insert passes the session empresa, but the desktop list passes '' (`listarGeneral` ignores
 * its parameter), so the empresa is only stamped on writes and the list stays tenant-wide (5.6b). [DEVIATION] the desktop
 * says "una Tamano"; the web port words the real gender.
 */
export const tamanos = referenceCatalog({ slug: 'tamanos', idKey: 'id_tamano', entity: 'un Tamano', formId: 'miTamano', title: 'Tamano', stamp: ['id_usuario', 'id_empresa'] });
