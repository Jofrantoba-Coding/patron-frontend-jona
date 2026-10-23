/**
 * Punto de Venta (`RegisterPuntoVenta`, R-REF-6), the Wave 2 face of the W1 `puntosVenta` section: the route is `/v1/punto-venta`
 * and `GET /v1/puntos-venta?id_empresa=` keeps the W1 item shape (R-REG-12, S-MOCK-34). `DAOPuntoVenta.insertar/modificar/eliminar`
 * take the session user but no empresa (the empresa is that of the chosen localidad), so only the user is stamped. The
 * empresa combo lists every empresa and the localidad combo those of the chosen one. `DAOPuntoVenta.listar` takes the session
 * empresa, but the web list stays tenant-wide: the W1 section is shared by every empresa of the tenant and the form picks any
 * of them, so the list shows all with its Empresa column. [DEVIATION] the desktop empresa message says "un Localidad"; the web
 * port names the Punto de Venta. The form field `Descripción` is stored as the W1 `name`. The checks are empresa, localidad,
 * descripcion, direccion, telefono (no max, no document) and the departamento > provincia > distrito cascade, in that order.
 * The desktop also sends the estado `A` on insert; it carries no field and no screen, so it is a `constants` entry (R-REF-9).
 * @type {import('../schema.js').CatalogDef}
 */
export const puntoVenta = {
  slug: 'punto-venta',
  section: 'puntosVenta',
  idKey: 'id',
  codeWidth: 0,
  entity: 'un Punto de Venta',
  scope: 'tenant',
  seed: null,
  formId: 'mi_puntoventa',
  title: 'Punto de Venta',
  menu: { parent: 'mnGenerales', label: 'Punto de Venta' },
  optionLabel: 'name',
  stamp: ['id_usuario'],
  constants: { estado: 'A' },
  messages: { style: 'M1' },
  fields: [
    { name: 'id', kind: 'code', label: 'Código' },
    { name: 'id_empresa', kind: 'select', label: 'Empresa', required: true, source: { catalog: 'empresa' } },
    { name: 'id_localidad', kind: 'select', label: 'Localidad', required: true, source: { catalog: 'localidades' }, dependsOn: [{ field: 'id_empresa', filterKey: 'id_empresa' }] },
    { name: 'name', kind: 'text', label: 'Descripción', required: true, max: 100, normalize: ['upper'] },
    { name: 'direccion', kind: 'text', label: 'Dirección', required: true, max: 100, normalize: ['upper'] },
    { name: 'telefono', kind: 'text', label: 'Teléfono', msgLabel: 'su Telefono', required: true },
    { name: 'id_ubigeo', kind: 'select', label: 'Distrito', required: true, source: { catalog: 'ubigeo' } },
  ],
  columns: [
    { key: 'id', header: 'Código' },
    { key: 'empresa', header: 'Empresa' },
    { key: 'localidad', header: 'Localidad' },
    { key: 'name', header: 'Descripción' },
    { key: 'direccion', header: 'Dirección' },
    { key: 'telefono', header: 'Teléfono' },
    { key: 'departamento', header: 'Departamento' },
    { key: 'provincia', header: 'Provincia' },
    { key: 'distrito', header: 'Distrito' },
  ],
  joins: [
    { as: 'empresa', ref: 'id_empresa', display: 'name' },
    { as: 'localidad', ref: 'id_localidad', display: 'descripcion' },
    // INEI codes nest by prefix: departamento 2 digits, provincia 4, distrito 6.
    { as: 'departamento', ref: 'id_ubigeo', display: 'name', prefixLen: 2 },
    { as: 'provincia', ref: 'id_ubigeo', display: 'name', prefixLen: 4 },
    { as: 'distrito', ref: 'id_ubigeo', display: 'name', prefixLen: 6 },
  ],
};
