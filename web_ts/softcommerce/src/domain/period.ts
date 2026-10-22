/** Period rules of login step 2. Dates are ISO `yyyy-MM-dd` strings, so valid ones compare lexicographically. */

export type PeriodError = 'INVALID_DATE' | 'BEFORE_ACTIVITY_START' | 'END_BEFORE_START' | 'DIFFERENT_YEAR';

export interface PeriodInput {
  fechaInicio: string;
  fechaFin: string;
  /** `INICIO_ACTIVIDADES` of the empresa. */
  inicioActividades: string;
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** BR-02-1: a real calendar day in `yyyy-MM-dd`. */
export function isValidIsoDate(value: string): boolean {
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

/** BR-02-2: inicio is not before the empresa's start of activity. */
export function isOnOrAfterActivityStart(fechaInicio: string, inicioActividades: string): boolean {
  return fechaInicio >= inicioActividades;
}

/** BR-02-3: fin is not before inicio. */
export function isEndNotBeforeStart(fechaInicio: string, fechaFin: string): boolean {
  return fechaFin >= fechaInicio;
}

/** BR-02-4: both dates fall in the same accounting year. */
export function isSameAccountingYear(fechaInicio: string, fechaFin: string): boolean {
  return fechaInicio.slice(0, 4) === fechaFin.slice(0, 4);
}

/** Checks the rules in order and returns the first violation, or null when the period is valid. */
export function validatePeriod({ fechaInicio, fechaFin, inicioActividades }: PeriodInput): PeriodError | null {
  if (!isValidIsoDate(fechaInicio) || !isValidIsoDate(fechaFin)) return 'INVALID_DATE';
  if (!isOnOrAfterActivityStart(fechaInicio, inicioActividades)) return 'BEFORE_ACTIVITY_START';
  if (!isEndNotBeforeStart(fechaInicio, fechaFin)) return 'END_BEFORE_START';
  if (!isSameAccountingYear(fechaInicio, fechaFin)) return 'DIFFERENT_YEAR';
  return null;
}
