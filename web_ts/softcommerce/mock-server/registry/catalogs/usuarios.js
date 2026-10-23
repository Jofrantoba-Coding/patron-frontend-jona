/**
 * Usuario (`RnUsuario.listarGeneral()`, R-REF-11): the read-only list behind the Usuario select of a UsuarioCorrelativo. The desktop lists every user
 * of the company database by its nombre (`listarGeneral` passes no empresa and only the logical state A), so the lookup is per tenant, not per
 * empresa. The rows are projected from the auth `users.json` (`project: 'users'`): one source, no copy, and the password never leaves it.
 * No screen, no menu node.
 * @type {import('../schema.js').CatalogDef}
 */
export const usuarios = {
  slug: 'usuarios',
  idKey: 'id_usuario',
  codeWidth: 0,
  entity: 'un Usuario',
  scope: 'tenant',
  seed: null,
  project: 'users',
  readOnly: true,
  optionLabel: 'nombre',
  messages: { style: 'M1' },
  fields: [
    { name: 'id_usuario', kind: 'code', label: 'Código' },
    { name: 'usuario', kind: 'text', label: 'Usuario', max: 50 },
    { name: 'nombre', kind: 'text', label: 'Nombre', required: true, max: 100 },
  ],
  columns: [{ key: 'id_usuario', header: 'Código' }, { key: 'usuario', header: 'Usuario' }, { key: 'nombre', header: 'Nombre' }],
};
