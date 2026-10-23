import { referenceCatalog } from './reference.js';

/** Clasificación de cliente (`RegisterClasifCliente`): an integer id (printed unpadded) and the shared `estado` checkbox. */
export const clasifClientes = referenceCatalog({
  slug: 'clasif-clientes', idKey: 'id_clasif_cliente', entity: 'una Clasif Cliente', formId: 'miClasifCliente', title: 'Clasificacion Cliente',
  codeWidth: 0,
  fields: [{ name: 'estado', preset: 'estado' }],
  columns: [{ key: 'estado', header: 'Estado', type: 'bool' }],
});
