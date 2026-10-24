/**
 * Trabajador (`RnTrabajador.listarTrabajador`, R-REF-11): the read-only list behind the BuscarTrabajador lookup of a TrabajadorPuntoVenta (R-LKP-8). The desktop
 * picks one in the `BuscarTrabajador` dialog and shows its nombre; the dialog searches the code, the nombre and the `dni` (RUC/DNI filter). Only the minimal rows the select needs
 * (code and nombre) are seeded; the full Trabajador catalog is a later wave. Per tenant (each company database has its own people), no screen, no menu node.
 * The id is the string code the desktop trims (`getId_trabajador().trim()`), kept as written.
 * @type {import('../schema.js').CatalogDef}
 */
export const trabajadores = {
  slug: 'trabajadores',
  idKey: 'id_trabajador',
  codeWidth: 0,
  entity: 'un Trabajador',
  scope: 'tenant',
  seed: 'trabajadores',
  readOnly: true,
  optionLabel: 'nombre',
  messages: { style: 'M1' },
  fields: [
    { name: 'id_trabajador', kind: 'code', label: 'Código' },
    { name: 'nombre', kind: 'text', label: 'Nombre', required: true, max: 100 },
    { name: 'dni', kind: 'text', label: 'DNI', max: 11 },
  ],
  columns: [{ key: 'id_trabajador', header: 'Código' }, { key: 'nombre', header: 'Nombre' }],
};
