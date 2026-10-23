import { referenceCatalog } from './reference.js';

/**
 * Vehículo (`RegisterVehiculo`, R-REF-6, S-REF-31). Style M2 (`Para {modo}, debes especificar su Placa.`) with the desktop spelling kept: the constancia
 * says `su Constacia`. `isRegisterValid` checks placa, constancia, peso, then the marca and the modelo (`debes Seleccionar Marca.` / `Modelo.`), so
 * that is the declared order even though the form shows the combos first. The placa and the constancia are `UpperCaseNumberDocument(30)` and the
 * peso an `IntegerDocument(10)` that starts at "0" and says `su Peso` when it is blank. Marca and modelo are independent combos over the rows with
 * estado A (`listarMarcaVehiculo("", "A")`, `listarModeloVehiculo("", "A")`). `mantVehiculo` passes the user and no empresa and `listarVehiculo(id, "", "")`
 * takes none: tenant scope, user stamp. Activo is checked and disabled on INSERT (`newRegister`), stored A / D. The Propietario (transportista)
 * picker and its list column are excluded (R-REF-12, S-REF-39). The id is a string with no pad evidence: three digits inferred, flagged for W6.
 */
export const vehiculos = referenceCatalog({
  slug: 'vehiculos', idKey: 'id_vehiculo', entity: 'un Vehiculo', formId: 'miVehiculo', title: 'Vehiculo', style: 'M2', descripcion: false,
  fields: [
    { name: 'id_marca', kind: 'select', label: 'Marca', required: true, message: 'Para {modo}, debes Seleccionar Marca.', source: { catalog: 'marcas-vehiculo', where: { estado: true } } },
    { name: 'id_modelo', kind: 'select', label: 'Modelo', required: true, message: 'Para {modo}, debes Seleccionar Modelo.', source: { catalog: 'modelos-vehiculo', where: { estado: true } } },
    { name: 'placa', kind: 'text', label: 'Placa', required: true, max: 30, normalize: ['upper'] },
    { name: 'constancia_inscripcion', kind: 'text', label: 'Const inscripcion', required: true, max: 30, normalize: ['upper'], msgLabel: 'su Constacia' },
    { name: 'peso', kind: 'number', label: 'Peso(KG)', required: true, scale: 0, max: 10, normalize: ['digits'], default: '0', msgLabel: 'su Peso' },
    { name: 'estado', preset: 'estado' },
  ],
  columns: [
    { key: 'placa', header: 'Placa' }, { key: 'constancia_inscripcion', header: 'Constancia Inscripcion' }, { key: 'marca', header: 'Marca' },
    { key: 'modelo', header: 'Modelo' }, { key: 'estado', header: 'Estado', type: 'bool' },
  ],
  joins: [{ as: 'marca', ref: 'id_marca', display: 'descripcion' }, { as: 'modelo', ref: 'id_modelo', display: 'descripcion' }],
  validation: ['placa', 'constancia_inscripcion', 'peso', 'id_marca', 'id_modelo', 'estado'],
});
