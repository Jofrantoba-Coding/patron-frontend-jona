// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { crearAlmacenSesiones } from './sesiones';

const ana = { email: 'ana@ejemplo.com', nombre: 'Ana', rol: 'administrador' as const };

describe('el almacén de sesiones del BFF', () => {
  it('el identificador tiene 256 bits aleatorios en base64url, y no se repite', () => {
    const sesiones = crearAlmacenSesiones();
    const ids = Array.from({ length: 50 }, () => sesiones.crear(ana));

    expect(ids.every((id) => /^[A-Za-z0-9_-]{43}$/.test(id))).toBe(true);
    expect(new Set(ids).size).toBe(50);
  });

  it('lee el usuario de una sesión viva, y nada con un identificador desconocido', () => {
    const sesiones = crearAlmacenSesiones();
    const id = sesiones.crear(ana);

    expect(sesiones.leer(id)).toEqual(ana);
    expect(sesiones.leer('inventado')).toBeUndefined();
    expect(sesiones.leer(undefined)).toBeUndefined();
  });

  it('vence por inactividad, y cada uso la extiende', () => {
    let ahora = 0;
    const sesiones = crearAlmacenSesiones({ inactividadMs: 1000, ahora: () => ahora });
    const id = sesiones.crear(ana);

    ahora = 900;
    expect(sesiones.leer(id)).toEqual(ana);
    ahora = 1800;
    expect(sesiones.leer(id)).toEqual(ana);
    ahora = 2801;
    expect(sesiones.leer(id)).toBeUndefined();
  });

  it('destruir la invalida en el servidor: la cookie vieja ya no sirve', () => {
    const sesiones = crearAlmacenSesiones();
    const id = sesiones.crear(ana);

    sesiones.destruir(id);

    expect(sesiones.leer(id)).toBeUndefined();
  });
});
