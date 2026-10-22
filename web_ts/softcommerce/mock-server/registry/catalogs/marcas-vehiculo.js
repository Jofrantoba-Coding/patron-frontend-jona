import { referenceCatalog } from './reference.js';

/**
 * Marca de Vehículo (`RegisterMarcaVehiculo`): style M2 and the shared `estado`. The desktop writes pass the session empresa but its
 * list passes '', so the empresa is only stamped on writes and the list stays tenant-wide (5.6b).
 */
export const marcasVehiculo = referenceCatalog({
  slug: 'marcas-vehiculo', idKey: 'id_marca_vehiculo', entity: 'una Marca Vehiculo', formId: 'miMarcaVehiculo', title: 'Marca Vehiculo',
  style: 'M2', stamp: ['id_usuario', 'id_empresa'],
  fields: [{ name: 'estado', preset: 'estado' }],
  columns: [{ key: 'estado', header: 'Estado', type: 'bool' }],
});
