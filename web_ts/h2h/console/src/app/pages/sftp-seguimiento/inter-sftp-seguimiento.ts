/**
 * Entrada de un directorio remoto del SFTP del banco, tal como la devuelve
 * `POST api/mantenimientos/h2h/v1/organizacion/sftp/explorar`.
 */
export interface EntradaSftp {
  nombre: string;
  /** ARCHIVO | DIRECTORIO */
  tipo: string;
  tamano: number;
  /** Fecha de modificación ya formateada por el backend (zona America/Lima). */
  fechaModificacion: string;
}

/**
 * Buzón configurado de la organización con su contenido. En el panorama viene con `entradas`
 * resueltas; si el `ls` de ese buzón falló, viene `error` y la lista vacía (un buzón inexistente
 * no tumba el panorama completo).
 */
export interface BuzonSftp {
  familia: string;
  /** IN | OUT */
  buzon: string;
  ruta: string;
  total: number;
  entradas: EntradaSftp[];
  error?: string;
}

/**
 * Respuesta del explorador. Dos modos:
 * - `PANORAMA` (sin ruta): todos los buzones con su contenido, en un solo ciclo SFTP.
 * - `DIRECTORIO` (con ruta): el contenido de esa ruta, para navegar dentro de un buzón.
 */
export interface ExploracionSftp {
  servidor: string;
  /** Banco del canal explorado (hoy BCP; el árbol tm_orcon es ORG#SFTP#<banco>#*). */
  banco: string;
  /** Bancos con SFTP configurado en la organización, para el selector. */
  bancos: string[];
  /** Raíz permitida: prefijo común de los buzones. Fuera de ahí el backend rechaza. */
  raiz: string;
  modo: 'PANORAMA' | 'DIRECTORIO';
  buzones?: BuzonSftp[];
  ruta: string | null;
  padre?: string | null;
  entradas: EntradaSftp[];
  total: number;
}

/**
 * Contrato de la página de seguimiento SFTP. La Vista aporta estado, filtrado y navegación local;
 * la Page implementa las llamadas al backend.
 */
export interface SftpSeguimientoPageContract {
  /** Panorama del banco activo: todos sus buzones con contenido (un ciclo SFTP). */
  cargarPanorama(): void;
  /** Cambia de banco y recarga el panorama. */
  cambiarBanco(banco: string): void;
  /** Entra a una ruta concreta (un ciclo SFTP). */
  abrirRuta(ruta: string): void;
  /** Vuelve a leer lo que se está viendo (panorama o directorio). */
  refrescar(): void;
}
