/** Una entrada del histórico de firmas (cada generación/carga es una entrada revertible). */
export interface RotacionLlave {
  etiqueta: string | null;
  secuencia: number | null;
  origen: string | null; // GENERADA | CARGADA
  fingerprint: string | null;
  desde: string | null;
  hasta: string | null;
  timestamp: string | null; // fecha-hora exacta de generación/carga
  usuario: string | null;
  revertible: boolean; // tiene etiqueta + material y no es la activa
  activa: boolean;
}

/** Llave generada automáticamente que aún no se activa (pendiente de rotación). */
export interface PendienteLlave {
  fingerprint: string | null;
  fingerprintSubclave: string | null;
  desde: string | null;
  hasta: string | null;
  generadaEn: string | null;
  usuario: string | null;
}

/**
 * Fila de estado derivada de una configuración de encriptación de tm_orcon (valor plano,
 * motor GPG). Expone la llave vigente + su histórico de rotaciones.
 */
export interface EstadoLlave {
  codigo: string;
  descripcion: string;
  algoritmo: string | null;
  formato: string | null;
  secretRef: string | null;
  fingerprint: string | null;
  origen: string | null;
  desde: string | null;
  hasta: string | null;
  finRotacion: string | null;
  alertaDias: number | null;
  etiquetaActiva: string | null;
  historial: RotacionLlave[];
  pendiente: PendienteLlave | null;
}

/**
 * Contrato de la página de configuración de llaves de cifrado (banco + organización).
 * La Vista aporta el estado (`estado`); la Page implementa las acciones contra el backend.
 */
export interface LlavesCifradoPageContract {
  estado: EstadoLlave[];
  recargar(): void;
  guardarBanco(): void;
  guardarOrg(): void;
  generarOrg(): void;
  activarOrg(): void;
  descartarOrg(): void;
  revertir(codigo: string, etiqueta: string): void;
}
