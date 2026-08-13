// inter-reloj-canal.ts — JONA Contrato del reloj del canal.
// Agnóstico de framework: describe qué expone el componente y con qué reglas.
import type { SubtipoVentana, VentanaSemanal } from '../../core/models';

/** Cómo de urgente es la cuenta atrás hacia el próximo cierre. */
export type UrgenciaCanal = 'abierto' | 'porCerrar' | 'critico' | 'cerrado' | 'sinDato';

/** Lectura ya resuelta que consume la vista. */
export interface LecturaCanal {
  urgencia: UrgenciaCanal;
  /** "Quedan 2 h 14 min" / "Cierra en 38 min" / "Canal cerrado". */
  titular: string;
  /** "Interbancaria · cierra 12:15" — qué corte manda ahora mismo. */
  detalle: string;
  /** Minutos hasta el cierre más próximo; null si no aplica. */
  minutosRestantes: number | null;
}

export interface InterRelojCanal {
  lectura: LecturaCanal;
  ventana: VentanaSemanal | null;
  /** Vuelve a pedir la ventana al backend. */
  refrescar: () => void;
}

/**
 * Umbral en minutos por debajo del cual el aviso pasa a rojo.
 *
 * No es un número redondo elegido al azar: por debajo de esto ya no da tiempo a
 * que el banco responda y a corregir un rechazo el mismo día. El banco tarda
 * entre 15 y 30 minutos en validar y procesar, y el pipeline propio
 * (generar → validar → cifrar → transmitir) se lleva otros ~10. Con menos de 45
 * minutos, enviar es apostar a que no haya rechazo.
 */
export const MINUTOS_CRITICOS = 45;

/** Por debajo de esto el aviso amarillea: aún se puede, pero sin margen para dos intentos. */
export const MINUTOS_AVISO = 120;

/** Cada cuánto recalcula la cuenta atrás. Un minuto basta: el dato es una hora de corte. */
export const REFRESCO_MS = 60_000;

/**
 * Nombres legibles de los subtipos. El catálogo los guarda en mayúscula y con
 * guion bajo, que es correcto como código y horrible como etiqueta.
 */
export const ETIQUETA_SUBTIPO: Record<string, string> = {
  INTERBANCARIA: 'Interbancaria',
  CUENTA_PROPIA: 'Cuenta propia',
  TERCEROS: 'Terceros',
};

export const etiquetaSubtipo = (subtipo: string): string =>
  ETIQUETA_SUBTIPO[subtipo] ??
  subtipo.charAt(0) + subtipo.slice(1).toLowerCase().replace(/_/g, ' ');

/** Subtipos que hoy están habilitados y operan, ordenados por cierre más próximo. */
export const subtiposVigentes = (
  ventana: VentanaSemanal | null,
  diaSemana: number
): SubtipoVentana[] =>
  (ventana?.subtipos ?? [])
    .filter((s) => s.habilitado)
    .filter((s) => s.dias.some((d) => d.diaSemana === diaSemana && d.opera && d.hasta))
    .sort((a, b) => {
      const ha = a.dias.find((d) => d.diaSemana === diaSemana)?.hasta ?? '';
      const hb = b.dias.find((d) => d.diaSemana === diaSemana)?.hasta ?? '';
      return ha.localeCompare(hb);
    });
