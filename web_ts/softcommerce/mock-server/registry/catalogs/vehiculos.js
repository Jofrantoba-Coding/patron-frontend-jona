import { referenceCatalog } from './reference.js';

/**
 * Vehículo (`RegisterVehiculo`, R-REF-6, S-REF-31). Style M2 (`Para {modo}, debes especificar su Placa.`) with the desktop spelling kept: the constancia
 * says `su Constacia`. `isRegisterValid` checks placa, constancia, peso, then the marca and the modelo (`debes Seleccionar Marca.` / `Modelo.`), so
 * that is the declared order even though the form shows the combos first. The placa and the constancia are `UpperCaseNumberDocument(30)` and the
 * peso an `IntegerDocument(10)` that starts at "0" and says `su Peso` when it is blank. Marca and modelo are independent combos over the rows with
 * estado A (`listarMarcaVehiculo("", "A")`, `listarModeloVehiculo("", "A")`). `mantVehiculo` passes the user and no empresa and `listarVehiculo(id, "", "")`
 * takes none: tenant scope, user stamp. Activo is checked and disabled on INSERT (`newRegister`), stored A / D. The id is a string with no pad evidence: three
 * digits inferred, flagged for W6.
 * Wave 3 (R-MST-6, S-REF-39 modified): the `Propietario` is the optional lookup over the transportistas (`txtTransportista` / `buscarTransportista`: a typed code is
 * padded to ten and read with `beanAnexoImp("6", "", "A", id, "")`, the active ones; the dialog is `FormBuscarAnexo(..., "6")`: Codigo, RUC/DNI and Descripcion filters,
 * CODIGO / RAZON SOCIAL / RUC/DNI columns, declared inline since no named picker covers it). `isRegisterValid` does not check it, so it adds no validation step. The
 * joined `transportista` (razon social) and `transportista_ruc` are the list column and the `FormBuscarVehiculo` filter keys. A vehiculo and the `Vehiculos` grid of its
 * transportista are one store (`transportistas` child `vehiculos`, R-MST-5).
 */
export const vehiculos = referenceCatalog({
  slug: 'vehiculos', idKey: 'id_vehiculo', entity: 'un Vehiculo', formId: 'miVehiculo', title: 'Vehiculo', style: 'M2', descripcion: false,
  fields: [
    { name: 'id_marca', kind: 'select', label: 'Marca', required: true, message: 'Para {modo}, debes Seleccionar Marca.', source: { catalog: 'marcas-vehiculo', where: { estado: true } } },
    { name: 'id_modelo', kind: 'select', label: 'Modelo', required: true, message: 'Para {modo}, debes Seleccionar Modelo.', source: { catalog: 'modelos-vehiculo', where: { estado: true } } },
    { name: 'placa', kind: 'text', label: 'Placa', required: true, max: 30, normalize: ['upper'] },
    { name: 'constancia_inscripcion', kind: 'text', label: 'Const inscripcion', required: true, max: 30, normalize: ['upper'], msgLabel: 'su Constacia' },
    { name: 'peso', kind: 'number', label: 'Peso(KG)', required: true, scale: 0, max: 10, normalize: ['digits'], default: '0', msgLabel: 'su Peso' },
    {
      name: 'id_anexo_empresa_transportista', kind: 'lookup', label: 'Propietario', display: 'transportista', source: { catalog: 'transportistas', where: { estado: true } },
      search: ['id_transportista', 'numero_doc', 'descripcion'],
      columns: [{ key: 'id_transportista', header: 'CODIGO' }, { key: 'descripcion', header: 'RAZON SOCIAL' }, { key: 'numero_doc', header: 'RUC/DNI' }],
      filters: [
        { field: 'id_transportista', label: 'Codigo', type: 'text', digits: true, max: 10 }, { field: 'numero_doc', label: 'RUC/DNI', type: 'text', digits: true, max: 11 },
        { field: 'descripcion', label: 'Descripcion', type: 'text', upper: true, max: 50 },
      ],
    },
    { name: 'estado', preset: 'estado' },
  ],
  columns: [
    { key: 'placa', header: 'Placa' }, { key: 'constancia_inscripcion', header: 'Constancia Inscripcion' }, { key: 'marca', header: 'Marca' },
    { key: 'modelo', header: 'Modelo' }, { key: 'transportista', header: 'Propietario' }, { key: 'estado', header: 'Estado', type: 'bool' },
  ],
  joins: [
    { as: 'marca', ref: 'id_marca', display: 'descripcion' }, { as: 'modelo', ref: 'id_modelo', display: 'descripcion' },
    { as: 'transportista', ref: 'id_anexo_empresa_transportista', display: 'descripcion' }, { as: 'transportista_ruc', ref: 'id_anexo_empresa_transportista', display: 'numero_doc' },
  ],
  // The exact keys of the FormBuscarVehiculo selects (R-MOCK-16): marca `1` never matches `001`.
  lookupFilters: { id_marca: {}, id_modelo: {} },
  validation: ['placa', 'constancia_inscripcion', 'peso', 'id_marca', 'id_modelo', 'estado'],
});
