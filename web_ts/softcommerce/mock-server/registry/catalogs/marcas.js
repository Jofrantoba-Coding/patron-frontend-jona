import { referenceCatalog } from './reference.js';

/** Marca (`RegisterMarca`). [DEVIATION] the desktop messages name "Familia"; the web port says Marca. */
export const marcas = referenceCatalog({ slug: 'marcas', idKey: 'id_marca', entity: 'una Marca', formId: 'miMarca', title: 'Marca' });
