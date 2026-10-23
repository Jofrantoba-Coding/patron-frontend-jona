import { referenceCatalog } from './reference.js';

/**
 * Modelo de Vehículo (`RegisterModeloVehiculo`): style M2, the shared `estado`, and the session user and empresa stamped on
 * writes; the desktop list passes '', so the list stays tenant-wide (5.6b). The string id has no pad evidence in the
 * desktop; three digits are inferred (flagged for W6).
 */
export const modelosVehiculo = referenceCatalog({
  slug: 'modelos-vehiculo', idKey: 'id_modelo', entity: 'un Modelo Vehiculo', formId: 'miModeloVehiculo', title: 'Modelo Vehiculo',
  style: 'M2', stamp: ['id_usuario', 'id_empresa'],
  fields: [{ name: 'estado', preset: 'estado' }],
  columns: [{ key: 'estado', header: 'Estado', type: 'bool' }],
});
