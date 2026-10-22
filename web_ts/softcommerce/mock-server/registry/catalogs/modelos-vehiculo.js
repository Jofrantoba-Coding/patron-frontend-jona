import { referenceCatalog } from './reference.js';

/**
 * Modelo de Vehículo (`RegisterModeloVehiculo`): style M2, the shared `estado`, and the session user and empresa stamped on
 * writes. R-REF-5 makes it empresa scope although the desktop list passes ''. The string id has no pad evidence in the
 * desktop; three digits are inferred (flagged for W6).
 */
export const modelosVehiculo = referenceCatalog({
  slug: 'modelos-vehiculo', idKey: 'id_modelo', entity: 'un Modelo Vehiculo', formId: 'miModeloVehiculo', title: 'Modelo Vehiculo', scope: 'empresa',
  style: 'M2',
  fields: [{ name: 'estado', preset: 'estado' }],
  columns: [{ key: 'estado', header: 'Estado', type: 'bool' }],
});
