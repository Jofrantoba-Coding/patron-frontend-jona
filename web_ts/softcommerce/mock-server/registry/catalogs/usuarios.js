/**
 * Usuario master (`RegisterUsuario`, `PanelTFUsuario`, `RnUsuario`, R-MST-7, R-REG-18, D15). It replaces the W2 read-only projection of the auth users: the rows are
 * still the `users.json` records the login reads (`backing: 'users'`, no copy, tenant-filtered, never a password key), but the register writes them. The slug, the
 * `id_usuario` key, the `nombre` label, the tenant scope and the `{ id, name }` options of the ACTIVE records stay, so UsuarioCorrelativo keeps its W2 suite.
 *
 * `isRegisterValid` checks, in this order: the trabajador (`Para {modo} un usuario, debes especificar un Trajador.`, the desktop spelling), the user name (`... su nombre.`;
 * the desktop bean field `nombre` is the LOGIN name, the web calls it `usuario`) and the password (`... su clave.`). `newRegister` unticks the four flags, so a new user can
 * log in only once an administrator ticks `Habilitado` and `Escritorio`. `executeInsert` stores `flaghabilitado` `H`/`D`: [INFERRED] the mock keeps its own `A`/`D` (R-AUTH-4),
 * and `flagEscritorio`/`flagWeb`/`flagContable` `S`/`N` (checkboxes here, flags derived server side). The legacy `modificar`, `eliminar` and `insertar` flags (hidden checkboxes) are
 * stored `N`. The web `nombre` (the lookup label) is the trabajador name, copied by the server on every write (`derive.fromRef`); `Cargo` is the tipo of the picked trabajador, shown
 * read-only (`fill`). `executeDelete` is `RnUsuario.eliminar`: the logical delete.
 * [DEVIATION] the desktop loads the decrypted password on UPDATE and CLONE; the server never returns it, UPDATE with a blank password keeps the stored one and CLONE asks again.
 * The `Nuevo Trabajador` button is not ported (S-REF-39).
 * @type {import('../schema.js').CatalogDef}
 */
export const usuarios = {
  slug: 'usuarios',
  idKey: 'id_usuario',
  codeWidth: 0,
  entity: 'un usuario',
  scope: 'tenant',
  seed: null,
  backing: 'users',
  formId: 'mi_usuario',
  title: 'Usuario',
  menu: { parent: 'mnGenerales', label: 'Usuario' },
  stamp: [],
  optionLabel: 'nombre',
  messages: { style: 'M1' },
  fields: [
    { name: 'id_usuario', kind: 'code', label: 'Código' },
    {
      name: 'id_trabajador', kind: 'lookup', picker: 'buscarTrabajador', label: 'Trabajador', required: true, message: 'Para {modo} un usuario, debes especificar un Trajador.',
      display: 'trabajador', source: { catalog: 'trabajadores', where: { estado: true } }, fill: { cargo: 'tipo_trabajador' }, fillReadOnly: ['cargo'],
    },
    { name: 'cargo', kind: 'text', label: 'Cargo', max: 60 },
    { name: 'usuario', kind: 'text', label: 'Nombre de Usuario', required: true, msgLabel: 'su nombre', max: 50 },
    { name: 'clave', kind: 'password', label: 'Contraseña', msgLabel: 'su clave', max: 20 },
    { name: 'escritorio', kind: 'boolean', label: 'Escritorio', default: false },
    { name: 'web', kind: 'boolean', label: 'Web', default: false },
    { name: 'contable', kind: 'boolean', label: 'Contable', default: false },
    { name: 'habilitado', kind: 'boolean', label: 'Habilitado', default: false },
  ],
  columns: [
    { key: 'id_usuario', header: 'Código' }, { key: 'usuario', header: 'Usuario' }, { key: 'nombre', header: 'Nombre' }, { key: 'habilitado', header: 'Habilitado', type: 'bool' },
  ],
  unique: [{ fields: ['usuario'], errorField: 'usuario', message: 'El nombre de usuario ya existe.' }],
  validation: ['id_trabajador', 'usuario', 'clave', 'cargo', 'escritorio', 'web', 'contable', 'habilitado', { ref: 'id_trabajador' }, { unique: 0 }],
  // The flags the login reads, derived from the checkboxes; `nombre` follows the trabajador (a body never writes either).
  derive: [
    { target: 'flaghabilitado', when: { field: 'habilitado', in: ['true'] }, then: 'A', else: 'D' },
    { target: 'flagEscritorio', when: { field: 'escritorio', in: ['true'] }, then: 'S', else: 'N' },
    { target: 'flagWeb', when: { field: 'web', in: ['true'] }, then: 'S', else: 'N' },
    { target: 'flagContable', when: { field: 'contable', in: ['true'] }, then: 'S', else: 'N' },
    { target: 'nombre', fromRef: { field: 'id_trabajador', key: 'nombre' } },
  ],
  constants: { modificar: 'N', eliminar: 'N', insertar: 'N' },
};
