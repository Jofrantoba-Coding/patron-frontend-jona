/**
 * Empresa (`RegisterEmpresa`, R-REF-5), the Wave 2 face of the W1 `empresas` section: the route is `/v1/empresa`, the rows are
 * the W1 ones (`{ id, name }` plus the fields below), so `GET /v1/empresas` keeps its shape (R-REG-12, S-MOCK-34). The desktop
 * only modifies and details (`executeInsert` returns an empty string and `executeDelete` returns true), so those are the only
 * modes. The write (`RnEmpresa.modificar(empresa, usuario.getId_usuario())`) stores the session user and passes no empresa;
 * `listarEmpresa("")` lists them all, so nothing is scoped. [DEVIATION] the form field `Nombre` is stored as the W1 `name`, so
 * both routes see one value. The ruc is `IntegerDocument(11)` plus a `length != 11` check whose message is the RUC sentence for
 * blank and short alike. The desktop checks nombre, direccion (written "Direccion" in its message) and ruc, in that order,
 * and nothing else.
 * @type {import('../schema.js').CatalogDef}
 */
export const empresa = {
  slug: 'empresa',
  section: 'empresas',
  idKey: 'id',
  // The W1 ids are issued by the seed and print unpadded.
  codeWidth: 0,
  entity: 'una Empresa',
  scope: 'tenant',
  seed: null,
  formId: 'mi_principal',
  title: 'Empresa',
  menu: { parent: 'mnGenerales', label: 'Empresa' },
  optionLabel: 'name',
  stamp: ['id_usuario'],
  modes: ['UPDATE', 'DETAIL'],
  messages: { style: 'M1' },
  fields: [
    { name: 'id', kind: 'code', label: 'Código' },
    { name: 'name', kind: 'text', label: 'Nombre', required: true, max: 180, normalize: ['upper'] },
    { name: 'direccion', kind: 'text', label: 'Dirección', msgLabel: 'su Direccion', required: true, max: 180, normalize: ['upper'] },
    { name: 'ruc', kind: 'text', label: 'RUC', required: true, max: 11, minLen: 11, normalize: ['digits'] },
    { name: 'representante', kind: 'text', label: 'Representante', max: 80, normalize: ['upper'] },
    // Free text: the desktop sets no document on it.
    { name: 'telefono', kind: 'text', label: 'Teléfono' },
    { name: 'website', kind: 'text', label: 'Website', max: 255, normalize: ['lower'] },
    { name: 'direccion_comercial', kind: 'text', label: 'Dirección Comercial', max: 180, normalize: ['upper'] },
    { name: 'correo', kind: 'text', label: 'Correo', max: 200, normalize: ['lower'] },
    // The departamento > provincia > distrito cascade; the desktop stores an empty value while no distrito is chosen.
    { name: 'id_ubigeo', kind: 'select', label: 'Distrito', source: { catalog: 'ubigeo' } },
    { name: 'flag_percepcion', kind: 'boolean', label: 'Agente de Percepcion', default: false },
  ],
  columns: [
    { key: 'id', header: 'Código' },
    { key: 'name', header: 'Nombre' },
    { key: 'direccion', header: 'Dirección' },
    { key: 'ruc', header: 'RUC' },
    { key: 'representante', header: 'Representante' },
    { key: 'telefono', header: 'Teléfono' },
    { key: 'website', header: 'Website' },
    { key: 'direccion_comercial', header: 'Dirección Comercial' },
    { key: 'flag_percepcion', header: 'Ag. Percepción', type: 'bool' },
  ],
};
