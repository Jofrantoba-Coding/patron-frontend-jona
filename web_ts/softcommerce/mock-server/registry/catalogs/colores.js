import { referenceCatalog } from './reference.js';

/** Color (`RegisterColor`). The list and every write pass the session empresa (`DAOColor`), so it is empresa scope. */
export const colores = referenceCatalog({ slug: 'colores', idKey: 'id_color', entity: 'un Color', formId: 'miColor', title: 'Color', scope: 'empresa' });
