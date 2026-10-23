import { referenceCatalog } from './reference.js';

/** Laboratorio (`RegisterLaboratorio`): `pais` is optional. */
export const laboratorios = referenceCatalog({
  slug: 'laboratorios', idKey: 'id_laboratorio', entity: 'un Laboratorio', formId: 'miLaboratorioClinico', title: 'Laboratorio',
  fields: [{ name: 'pais', kind: 'text', label: 'Pais', max: 100, normalize: ['upper'] }],
  columns: [{ key: 'pais', header: 'Pais' }],
});
