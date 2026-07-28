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
/**
 * Depósito propio: un PUT que hicimos al buzón IN, leído de la bitácora `ta_sfs_sftp_sesion`.
 *
 * Existe porque **listar el IN del banco no sirve como evidencia de envío**: Sterling recoge el
 * archivo en segundos, así que un IN vacío no distingue «no se envió» de «ya lo recogieron». La
 * bitácora sobrevive al recojo e incluye los PUT con `resultado = ERROR`, que también pudieron
 * haber entregado el archivo.
 */
export interface DepositoSftp {
  nombre: string;
  ruta: string;
  /** OK | ERROR — resultado del PUT, no del ciclo completo. */
  resultado: string;
  bytes: number;
  /** Instante del PUT en ISO con offset, tal como lo registró la bitácora. */
  instante: string;
  familia: string;
  /** Qué disparó el ciclo (p. ej. ENVIO_PLANILLA). */
  disparador: string;
  usuario: string | null;
  resultadoSesion: string;
  /** Planilla que corresponde al archivo, si se pudo emparejar por nombre. */
  idPlanilla: string | null;
  /** Estado actual de esa planilla: dice en qué acabó el envío. */
  estadoPlanilla: string | null;
}

export interface BuzonSftp {
  familia: string;
  /** IN | OUT */
  buzon: string;
  ruta: string;
  total: number;
  entradas: EntradaSftp[];
  error?: string;
  /** Solo en buzones IN: lo que depositamos en la ventana consultada. */
  depositos?: DepositoSftp[];
  totalDepositos?: number;
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
  /** Todos los depósitos de la ventana, sin separar por familia. */
  depositos?: DepositoSftp[];
  totalDepositos?: number;
  /** Ventana efectivamente aplicada por el backend (eco de fecha + horas). */
  ventana?: { desde: string; hasta: string };
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

/** Ventana de tiempo de los depósitos del IN, en hora local. */
export interface VentanaDepositos {
  /** `yyyy-MM-dd`. */
  fecha: string;
  /** `HH:mm`. */
  horaInicio: string;
  /** `HH:mm`. */
  horaFin: string;
}
