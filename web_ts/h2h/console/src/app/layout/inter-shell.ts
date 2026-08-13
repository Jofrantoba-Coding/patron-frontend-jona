// inter-shell.ts — JONA Contrato del layout principal de la consola.
// Agnóstico de Angular y de servicios: describe QUÉ expone el shell.

// Las etapas y sus contadores viven en `core/models` porque los comparten el
// menú y el servicio que los cuenta; aquí solo se reexportan por comodidad.
import type { PendientesPorEtapa } from '../core/models';
export type { EtapaCanal, PendientesPorEtapa } from '../core/models';

export interface InterShell {
  /** Ruta activa completa, incluidas las hijas (`operaciones/pagos-masivos`). */
  activeKey: string;
  /** Navegación agrupada según la arquitectura de información. */
  nav: unknown;
  /** Trabajo pendiente por etapa; alimenta los badges. */
  pendientes: PendientesPorEtapa;

  onNav: (key: string) => void;
  logout: () => void;
}

/**
 * Arquitectura de información de la consola.
 *
 * El menú anterior era una lista plana de 17 ítems en dos grupos ("Operación" y
 * "Administración") donde convivían, al mismo nivel, un producto de pago y la
 * configuración del SFTP. No dejaba ver que H2H es un proceso con etapas.
 *
 * Ahora los grupos siguen el modelo mental del negocio:
 *
 *  1. EL FLUJO      las cuatro etapas del canal, numeradas y en orden. Cada
 *                   etapa es una capa con su propia máquina de estados
 *                   (operación → programación → planilla → respuesta).
 *  2. MAESTROS      los datos que alimentan el flujo.
 *  3. CANAL BCP     la conexión con el banco: credenciales, llaves, automatismos.
 *  4. GOBIERNO      quién puede hacer qué, y qué pasó.
 *
 * Las vistas por producto (Pagos Masivos, Transferencias, Factoring) dejan de
 * ser ítems hermanos: son un filtro DENTRO de Operaciones, que es lo que
 * realmente son. Las rutas siguen existiendo, así que los enlaces guardados no
 * se rompen.
 */
export const GRUPOS_NAV = ['flujo', 'maestros', 'canal', 'gobierno'] as const;
export type GrupoNav = (typeof GRUPOS_NAV)[number];

export const ETIQUETA_GRUPO: Record<GrupoNav, string> = {
  flujo: 'El flujo H2H',
  maestros: 'Maestros',
  canal: 'Canal BCP',
  gobierno: 'Gobierno',
};
