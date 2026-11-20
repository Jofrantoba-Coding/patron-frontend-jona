import { describe, expect, it, vi } from 'vitest';
import { crearServicioFetch, ErrorRespuesta } from './crearServicioFetch';

/** Un fetch que responde siempre lo mismo y anota cómo se lo llamó. */
function fetchQueResponde(estado: number, cuerpo?: unknown) {
  return vi.fn<typeof fetch>(async () => new Response(cuerpo === undefined ? null : JSON.stringify(cuerpo), { status: estado }));
}

const PRODUCTO = { id: 'p-1', sku: 'TEC-001', nombre: 'Teclado', precio: 120, descripcion: 'Táctil', enlaceFabricante: 'https://fabricante.example' };

describe('el adaptador del cliente contra el BFF', () => {
  it('cada petición va al mismo origen, con la cabecera propia y sin token: la sesión la lleva la cookie', async () => {
    const pedir = fetchQueResponde(200, { usuario: { nombre: 'Ana' }, permisos: { eliminar: true } });
    const servicio = crearServicioFetch({ fetch: pedir });

    await servicio.actual();
    await servicio.entrar('ana@ejemplo.com', 'secreta123');

    for (const [url, opciones] of pedir.mock.calls) {
      expect(String(url)).toMatch(/^\/api\//);
      expect(opciones?.credentials).toBe('same-origin');
      expect(new Headers(opciones?.headers).get('X-Jona-Csrf')).toBe('1');
      expect(new Headers(opciones?.headers).has('Authorization')).toBe(false);
    }
  });

  it('no confía en la respuesta: descarta los campos que no conoce y rechaza los de tipo equivocado', async () => {
    const conDeMas = crearServicioFetch({ fetch: fetchQueResponde(200, [{ ...PRODUCTO, costoInterno: 80 }]) });
    const conTipoMal = crearServicioFetch({ fetch: fetchQueResponde(200, [{ ...PRODUCTO, precio: '120' }]) });
    const sinLista = crearServicioFetch({ fetch: fetchQueResponde(200, { productos: [] }) });

    expect(await conDeMas.listar()).toEqual([PRODUCTO]);
    await expect(conTipoMal.listar()).rejects.toBeInstanceOf(ErrorRespuesta);
    await expect(sinLista.listar()).rejects.toBeInstanceOf(ErrorRespuesta);
  });

  it('una sesión con permisos que no son booleanos no se acepta', async () => {
    const servicio = crearServicioFetch({ fetch: fetchQueResponde(200, { usuario: { nombre: 'Ana' }, permisos: { eliminar: 'si' } }) });

    await expect(servicio.actual()).rejects.toBeInstanceOf(ErrorRespuesta);
  });

  it('traduce los estados: 401 es sin sesión, 403 prohibido, 404 no encontrado; 500 rechaza', async () => {
    expect(await crearServicioFetch({ fetch: fetchQueResponde(401, { error: 'sin-sesion' }) }).actual()).toBeUndefined();
    expect(await crearServicioFetch({ fetch: fetchQueResponde(401, { error: 'credenciales' }) }).entrar('a@b.c', 'x')).toBeUndefined();
    expect(await crearServicioFetch({ fetch: fetchQueResponde(204) }).eliminar('p-1')).toBe('eliminado');
    expect(await crearServicioFetch({ fetch: fetchQueResponde(403, { error: 'prohibido' }) }).eliminar('p-1')).toBe('prohibido');
    expect(await crearServicioFetch({ fetch: fetchQueResponde(404, { error: 'no-encontrado' }) }).eliminar('p-1')).toBe('no-encontrado');
    await expect(crearServicioFetch({ fetch: fetchQueResponde(500, { error: 'interno' }) }).listar()).rejects.toThrow('HTTP 500');
  });
});
