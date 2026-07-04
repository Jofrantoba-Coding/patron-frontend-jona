import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Fusiona clases condicionales (clsx) y resuelve conflictos de utilidades
 * Tailwind (tailwind-merge). Es el mismo helper `cn` del sistema JONA en React,
 * portado sin cambios de contrato para Angular.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export type { ClassValue };
