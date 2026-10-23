import { referenceCatalog } from './reference.js';

/** Marca de Vehículo (`RegisterMarcaVehiculo`): style M2 and the shared `estado`. The desktop writes also pass the empresa (audit in W2-5). */
export const marcasVehiculo = referenceCatalog({
  slug: 'marcas-vehiculo', idKey: 'id_marca_vehiculo', entity: 'una Marca Vehiculo', formId: 'miMarcaVehiculo', title: 'Marca Vehiculo',
  style: 'M2',
  fields: [{ name: 'estado', preset: 'estado' }],
  columns: [{ key: 'estado', header: 'Estado', type: 'bool' }],
});
