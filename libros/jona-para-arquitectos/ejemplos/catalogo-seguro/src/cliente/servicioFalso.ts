// Punto de sustitución 2: el servicio falso, para trabajar la UI sin el BFF (npm run dev y
// ?falso en la URL) y para las pruebas. No llega al bundle de producción: la entrada lo importa
// con import() dentro de import.meta.env.DEV (regla 4 de test/architecture), y
// test/artefacto.test.ts busca su marca en dist/client.
import type { Producto } from '../dominio/Producto';
import type { SesionUsuario } from '../dominio/SesionUsuario';
import type { InterServicioAplicacion } from '../ui/aplicacion';

/** Aparece en los datos falsos: en pantalla avisa de dónde vienen, y en un bundle delata al servicio. */
export const ORIGEN_SERVICIO_FALSO = 'jona-catalogo-seguro/servicio-falso';

const PRODUCTOS: readonly Producto[] = [
  { id: 'p-1', sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120, descripcion: `Dato de ${ORIGEN_SERVICIO_FALSO}`, enlaceFabricante: 'https://fabricante.example/teclados' },
  { id: 'p-2', sku: 'MOU-002', nombre: 'Mouse inalámbrico', precio: 45.5, descripcion: `Dato de ${ORIGEN_SERVICIO_FALSO}` },
];

/** Cualquier contraseña sirve: este servicio no autentica a nadie, solo da vida a la pantalla. */
export function crearServicioFalso(): InterServicioAplicacion {
  let sesion: SesionUsuario | undefined;
  let productos = [...PRODUCTOS];
  return {
    actual: async () => sesion,
    entrar: async (email) => (sesion = { usuario: { nombre: email.split('@')[0] }, permisos: { eliminar: true } }),
    salir: async () => {
      sesion = undefined;
    },
    listar: async () => productos.map((p) => ({ ...p })),
    eliminar: async (id) => {
      const antes = productos.length;
      productos = productos.filter((p) => p.id !== id);
      return productos.length < antes ? 'eliminado' : 'no-encontrado';
    },
  };
}
