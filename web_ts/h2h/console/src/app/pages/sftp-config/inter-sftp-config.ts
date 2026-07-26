/**
 * Estado derivado del nodo de CONEXIÓN SFTP (tm_orcon, clase SECRETO_REF,
 * código ORG#SFTP#<banco>#CONEXION). Los valores reales viven en Vault; aquí solo se
 * exponen los secretRef (para saber qué está configurado) + la metadata no sensible.
 */
export interface EstadoConexionSftp {
  codigo: string;
  descripcion: string;
  auth: string | null;
  ambiente: string | null;
  reintentos: number | null;
  timeoutSegundos: number | null;
  hostRef: string | null;
  puertoRef: string | null;
  usuarioRef: string | null;
  passwordRef: string | null;
  /** Los cuatro secretRef de conexión están presentes. */
  configurado: boolean;
}

/**
 * Estado derivado de un nodo de DIRECTORIOS (buzón) SFTP por familia
 * (código ORG#SFTP#<banco>#<familia>). Cada buzón IN/OUT es un secretRef a Vault.
 */
export interface EstadoDirectorioSftp {
  codigo: string;
  familia: string; // TRANSFERENCIAS | PAGOS_MASIVOS | FACTORING | RECAUDACION
  inRef: string | null;
  outRef: string | null;
  /** Ambos secretRef (in/out) están presentes. */
  configurado: boolean;
}

/** Familia de buzón + su etiqueta y los productos H2H que la usan (informativo). */
export interface FamiliaSftp {
  key: string;
  label: string;
  productos: string;
}

/**
 * Contrato de la página de configuración SFTP (conexión + directorios por banco).
 * La Vista aporta el estado; la Page implementa las acciones contra el backend.
 */
export interface SftpConfigPageContract {
  recargar(): void;
  guardarConexion(): void;
  guardarDirectorios(): void;
}
