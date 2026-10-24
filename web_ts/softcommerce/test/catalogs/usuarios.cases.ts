import type { CatalogCase, Outcome } from './cases';

/**
 * Table of the master `usuarios` (`RegisterUsuario`, R-MST-7, S-MST-13..16, S-MOCK-51, S-MOCK-55), against the real registry and seeds, on the in-browser mock and the
 * HTTP mock. Seeded users of the `demo` tenant: 1 admin, 2 cajero, 3 bloqueado (disabled), 4 soloweb (no desktop access). The trabajador 001 is JUAN PEREZ LOPEZ.
 */
const invalid = (fields: string[], messages?: string[]): Outcome => ({ status: 422, code: 'VALIDATION_ERROR', fields, messages });
const VALID = { id_trabajador: '001', usuario: 'nuevo', clave: 'secreto1', clave_confirmacion: 'secreto1' };

const write = (name: string, body: Record<string, unknown>, expect: Outcome, deviation?: boolean): CatalogCase => ({ name: `usuarios ${name}`, slug: 'usuarios', deviation, steps: [{ op: 'create', body }], expect });
const update = (name: string, id: string, body: Record<string, unknown>, expect: Outcome): CatalogCase => ({ name: `usuarios ${name}`, slug: 'usuarios', steps: [{ op: 'update', id, body }], expect });

export const USUARIO_CASES: CatalogCase[] = [
  // S-MST-13: the order of the desktop checks and its sentences (the spelling `Trajador` is the desktop's).
  write('S-MST-13 an empty INSERT says the trabajador first', {}, invalid(['id_trabajador'], ['Para agregar un usuario, debes especificar un Trajador.'])),
  write('S-MST-13 then the user name', { id_trabajador: '001' }, invalid(['usuario'], ['Para agregar un usuario, debes especificar su nombre.'])),
  write('S-MST-13 then the key', { id_trabajador: '001', usuario: 'x' }, invalid(['clave'], ['Para agregar un usuario, debes especificar su clave.'])),
  update('S-MST-13 the same sentences read modificar on UPDATE (trabajador)', '2', { id_trabajador: '', usuario: 'cajero' }, invalid(['id_trabajador'], ['Para modificar un usuario, debes especificar un Trajador.'])),
  update('S-MST-13 the same sentences read modificar on UPDATE (name)', '2', { id_trabajador: '001', usuario: '' }, invalid(['usuario'], ['Para modificar un usuario, debes especificar su nombre.'])),

  // S-MST-14: the four flags open OFF; the stored flags follow users.json (A/D and S/N).
  write('S-MST-14 a body with no flags stores them all OFF: D and N', VALID, { ok: true, match: { habilitado: false, escritorio: false, web: false, contable: false, flaghabilitado: 'D', flagEscritorio: 'N', flagWeb: 'N', flagContable: 'N' } }),
  write('S-MST-14 ticked flags are stored A and S', { ...VALID, habilitado: true, escritorio: true, web: true, contable: true }, { ok: true, match: { habilitado: true, flaghabilitado: 'A', flagEscritorio: 'S', flagWeb: 'S', flagContable: 'S' } }),
  write('R-MST-7 a body cannot write the stored flags or the legacy ones directly', { ...VALID, flaghabilitado: 'A', flagEscritorio: 'S', modificar: 'S' }, { ok: true, match: { flaghabilitado: 'D', flagEscritorio: 'N', modificar: 'N', eliminar: 'N', insertar: 'N' } }),

  // S-MST-16 / S-MOCK-55: nombre follows the trabajador, the name is unique, the trabajador must be active.
  write('S-MST-16 the nombre is the trabajador name, whatever the body says', { ...VALID, nombre: 'IMPOSTOR' }, { ok: true, match: { nombre: 'JUAN PEREZ LOPEZ', usuario: 'nuevo', id_usuario: '5' } }),
  write('S-MST-16 a second user with an existing name is a 409 on usuario with the new text', { ...VALID, usuario: 'cajero' }, { status: 409, code: 'DUPLICATE', fields: ['usuario'], messages: ['El nombre de usuario ya existe.'] }),
  write('S-MOCK-55 an unknown trabajador is a 422 on id_trabajador', { ...VALID, id_trabajador: '999' }, invalid(['id_trabajador'])),
  write('S-MOCK-55 a retired trabajador is a 422 on id_trabajador', { ...VALID, id_trabajador: '004' }, invalid(['id_trabajador'])),
  write('S-MOCK-55 a deactivated trabajador is a 422 on id_trabajador', { ...VALID, id_trabajador: '003' }, invalid(['id_trabajador'])),

  // S-MOCK-51 / S-MST-15: the password rules of the server.
  write('S-MOCK-51 no clave is a 422 on clave', { id_trabajador: '001', usuario: 'nuevo' }, invalid(['clave'])),
  write('S-MOCK-51 a 21-character clave is a 422 on clave', { ...VALID, clave: 'a'.repeat(21), clave_confirmacion: 'a'.repeat(21) }, invalid(['clave'])),
  write('S-MOCK-51 20 characters are accepted', { ...VALID, clave: 'a'.repeat(20), clave_confirmacion: 'a'.repeat(20) }, { ok: true }),
  write('S-MOCK-51 a different confirmation is a 422 on clave_confirmacion with the new sentence', { ...VALID, clave_confirmacion: 'otra' }, invalid(['clave_confirmacion'], ['La confirmación de la contraseña no coincide.'])),
  update('S-MOCK-51 a PUT with no clave keeps the stored one (and the other values)', '2', { id_trabajador: '001', usuario: 'cajero2' }, { ok: true, match: { usuario: 'cajero2', nombre: 'JUAN PEREZ LOPEZ' } }),
  update('S-MOCK-51 a PUT with a blank clave pair is the same', '2', { id_trabajador: '001', usuario: 'cajero', clave: '', clave_confirmacion: '' }, { ok: true }),
  update('S-MOCK-51 a PUT with a clave and no confirmation is a 422 on the confirmation', '2', { id_trabajador: '001', usuario: 'cajero', clave: 'nueva' }, invalid(['clave_confirmacion'])),

  // The list, the get and the lookup keep the W2 shape of the users.
  { name: 'usuarios R-MST-17 the list shows the four seeded users', slug: 'usuarios', steps: [{ op: 'list' }], expect: { ok: true, total: 4 } },
  { name: 'usuarios R-MST-17 get keeps the W2 keys', slug: 'usuarios', steps: [{ op: 'get', id: '2' }], expect: { ok: true, match: { id_usuario: '2', usuario: 'cajero', nombre: 'Cajero Uno', habilitado: true, escritorio: true, web: false } } },
  { name: 'usuarios S-MOCK-55 a created user shows in the lookup with the derived nombre', slug: 'usuarios', steps: [{ op: 'create', body: VALID }, { op: 'options' }], expect: { ok: true, items: [{ id: '1', name: 'Administrador' }, { id: '2', name: 'Cajero Uno' }, { id: '3', name: 'Usuario Deshabilitado' }, { id: '4', name: 'Sin Acceso Escritorio' }, { id: '5', name: 'JUAN PEREZ LOPEZ' }] } },
  { name: 'usuarios S-AUTH-28 a deleted user leaves the list and the lookup', slug: 'usuarios', steps: [{ op: 'remove', id: '2' }, { op: 'options' }], expect: { ok: true, items: [{ id: '1', name: 'Administrador' }, { id: '3', name: 'Usuario Deshabilitado' }, { id: '4', name: 'Sin Acceso Escritorio' }] } },
  { name: 'usuarios an unknown user is a 404', slug: 'usuarios', steps: [{ op: 'get', id: '99' }], expect: { status: 404, code: 'NOT_FOUND' } },
];
