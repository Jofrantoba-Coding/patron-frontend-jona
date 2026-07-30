/**
 * Contratos del seguimiento de schedulers, tal como los devuelve
 * `POST api/schedulers/h2h/v1/seguimiento/panorama`.
 */

/** Una corrida de la bitácora `sch_h2h.ta_jbc_job_corrida`. */
export interface CorridaJob {
  id: string;
  idOrganizacion: string;
  job: string;
  /** PROGRAMADO (cron) | MANUAL (alguien la disparó desde aquí). */
  disparador: string;
  /** EN_CURSO | OK | OMITIDO | ERROR. */
  estado: string;
  /** Instancia que la ejecutó (`app:puerto`). Con varias desplegadas, dice cuál trabajó. */
  instancia: string;
  hilo: string;
  usuario: string | null;
  idTraza: string | null;
  inicio: string;
  fin: string | null;
  duracionMs: number | null;
  /** Planes para PROGRAMACION, planillas para los otros dos. */
  resueltos: number | null;
  /** Por qué se omitió o por qué falló. Null cuando acabó OK. */
  motivo: string | null;
  /**
   * `true` = fila de LATIDO: una sola por (organización, job), que se sobreescribe en cada tick.
   * `false` = HISTÓRICO: una corrida que hizo algo o falló.
   */
  latido: boolean;
  /** Qué estaba procesando. La forma depende del job. */
  metadata?: Record<string, unknown> | null;
}

/** Una organización dentro del bloque de un job. */
export interface JobPorOrganizacion {
  idOrganizacion: string;
  codigo: string;
  /**
   * Estado EFECTIVO del interruptor tras la cascada de HAB-08 §6.4 — no el valor crudo del nodo.
   * Un `forzarApagado` de plataforma vence al encendido de la organización.
   */
  interruptor: boolean;
  ultimaCorrida: CorridaJob | null;
}

/** Un job con su ficha y su estado por organización. */
export interface JobPanorama {
  /** PROGRAMACION | CICLO_SFTP | DECISION. */
  job: string;
  /** Código del nodo de parametría que lo enciende (`H2H#BCP#JOBS#<JOB>`). */
  codigoParametria: string;
  descripcion: string;
  organizaciones: JobPorOrganizacion[];
}

/**
 * Estado de la INSTANCIA que respondió. No es verdad global: con varias desplegadas, otra puede
 * tener otro cron o el interruptor apagado. Por eso viene con su nombre.
 */
export interface InstanciaSchedulers {
  nombre: string;
  /** Interruptor de instancia (`h2h.jobs.habilitado`). Apagado = ningún job corre aquí. */
  habilitado: boolean;
  enCurso: number;
  crones: Record<string, string>;
  pool: {
    disponible: boolean;
    activos?: number;
    corePoolSize?: number;
    maxPoolSize?: number;
    /** Cola que no baja = tenants sin terminar de ticks anteriores. */
    enCola?: number;
  };
}

/** Agregado por (job, estado) de la ventana consultada. Solo histórico. */
export interface ResumenJob {
  job: string;
  estado: string;
  corridas: number;
  resueltos: number;
  msMaximo: number;
}

export interface OrganizacionRef {
  idOrganizacion: string;
  codigo: string;
}

/** Respuesta completa del panorama: una llamada pinta la pantalla entera. */
export interface PanoramaSchedulers {
  instancia: InstanciaSchedulers;
  organizaciones: OrganizacionRef[];
  jobs: JobPanorama[];
  /** Corridas atascadas en EN_CURSO más de `minutosColgada`: murió la JVM a mitad. */
  colgadas: CorridaJob[];
  resumen: ResumenJob[];
  minutosColgada: number;
  diasResumen: number;
  /** TODAS | ORGANIZACION. */
  alcance: string;
  generado: string;
}

/** Configuración del tenant que gobierna los jobs (`/configuracion/leer`). */
export interface ConfiguracionJobs {
  interruptores: Record<
    string,
    { codigo: string; organizacion: unknown; plataforma: unknown; efectivo: boolean }
  >;
  /** Cada bloque trae el valor propio y el de plataforma que aplicaría si se borrara el propio. */
  modoEnvio: BloqueConfig;
  cantidadProgramable: BloqueConfig;
  reintentos: BloqueConfig;
  horarios: {
    /** Ventana del CANAL: es del banco, la organización no puede cambiarla. */
    ventanaCanal: unknown;
    subtipos: Record<string, { codigo: string; organizacion: unknown; banco: unknown }>;
  };
  generado: string;
}

export interface BloqueConfig {
  codigo: string;
  organizacion: unknown;
  codigoPlataforma?: string;
  plataforma?: unknown;
}

/**
 * Contrato de la página. La Vista aporta estado y presentación; la Page implementa las llamadas
 * al backend.
 */
export interface SchedulersSeguimientoPageContract {
  /** Panorama del alcance actual: instancia, jobs, colgadas y resumen en una lectura. */
  cargarPanorama(): void;
  /** Cambia la organización mirada y recarga. */
  cambiarOrganizacion(idOrganizacion: string): void;
  /** Dispara un job sin esperar al cron. */
  ejecutar(job: string): void;
  /** Enciende o apaga un job para la organización activa. */
  cambiarInterruptor(job: string, idOrganizacion: string, habilitado: boolean): void;
  /** Vuelve a leer lo que se está viendo. */
  refrescar(): void;
}
