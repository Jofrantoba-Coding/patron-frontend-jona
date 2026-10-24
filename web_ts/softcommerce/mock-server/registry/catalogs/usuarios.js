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
  // Autorizar Series (`controlNullify` of PanelTFUsuario, R-PRM-6, D14): the toolbar button opens the series panel of the selected usuario. The desktop button
  // is the `Anular` slot; the web names it and gates it with `modify` (the grant has `nullify` off). Pressed with no selection it answers `Seleccione un registro de la tabla`.
  actions: [{ id: 'autorizar-series', label: 'Autorizar Series', kind: 'deferred', rule: 'autorizarSeries', placement: 'list-toolbar', flag: 'modify' }],
  // The series of a usuario are the W2 usuario-correlativos rows (R-PRM-7). `tab: false`: a child resource reached only from the Autorizar Series panel, never a register tab (R-MD-10).
  children: {
    series: {
      tab: false, entry: 'none', store: { entry: 'usuario-correlativos', key: 'id_usuario' },
      columns: [
        { key: 'habilitar', header: 'ESTADO' }, { key: 'id_correlativo', header: 'ID CORRELATIVO' }, { key: 'punto_venta', header: 'PUNTO DE VENTA' },
        { key: 'tipo_documento', header: 'TIPO DE DOCUMENTO' }, { key: 'serie', header: 'SERIE' }, { key: 'fecha_inicio', header: 'FECHA INICIO' }, { key: 'fecha_fin', header: 'FECHA FIN' },
      ],
      actions: [
        { id: 'activate', label: 'Activar', kind: 'immediate', server: 'activarSerie' },
        { id: 'deactivate', label: 'Desactivar', kind: 'immediate', server: 'desactivarSerie' },
      ],
    },
  },
};
