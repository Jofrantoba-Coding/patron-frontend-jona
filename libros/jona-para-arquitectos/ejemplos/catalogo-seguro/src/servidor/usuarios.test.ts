// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { crearDirectorioUsuarios, registrarUsuario } from './usuarios';

const ana = { email: 'ana@ejemplo.com', nombre: 'Ana', rol: 'administrador' as const };

describe('el directorio de usuarios', () => {
  it('verifica la contraseña correcta y devuelve el usuario sin su hash', async () => {
    const directorio = crearDirectorioUsuarios([await registrarUsuario(ana, 'secreta123')]);

    expect(await directorio.verificar('ana@ejemplo.com', 'secreta123')).toEqual(ana);
  });

  it('el correo no distingue mayúsculas ni espacios alrededor', async () => {
    const directorio = crearDirectorioUsuarios([await registrarUsuario(ana, 'secreta123')]);

    expect(await directorio.verificar('  Ana@Ejemplo.com ', 'secreta123')).toEqual(ana);
  });

  it('una contraseña incorrecta y un correo desconocido dan la misma respuesta: ninguna', async () => {
    const directorio = crearDirectorioUsuarios([await registrarUsuario(ana, 'secreta123')]);

    expect(await directorio.verificar('ana@ejemplo.com', 'otra')).toBeUndefined();
    expect(await directorio.verificar('nadie@ejemplo.com', 'secreta123')).toBeUndefined();
  });

  it('guarda un hash con sal propia, nunca la contraseña', async () => {
    const [uno, dos] = [await registrarUsuario(ana, 'secreta123'), await registrarUsuario(ana, 'secreta123')];

    expect(JSON.stringify(uno)).not.toContain('secreta123');
    expect(uno.sal).not.toBe(dos.sal);
    expect(uno.hash).not.toBe(dos.hash);
  });
});
