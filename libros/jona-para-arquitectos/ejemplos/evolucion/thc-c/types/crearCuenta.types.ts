// Reconstrucción para análisis (no es el código original) de: Harol Rodriguez, "Patrón THC / THC-C", Medium, 2026-03-21,
// https://medium.com/@elbugdepajarito/patr%C3%B3n-thc-thc-c-2e7887a03921. Reproduce sus tipos y su estructura de módulos.
// El artículo importa ApiResponse y Cuenta desde este archivo; aquí se reexportan para que esos imports resuelvan.
export type { ApiErrorResponse, ApiResponse, ApiSuccessResponse } from '../utils/api.response.js';
export type { Cuenta } from './Cuenta.entity.js';

export interface CrearCuentaFormData {
  nombre: string;
  email: string;
  password: string;
}

export interface CrearCuentaErrors {
  nombre?: string;
  email?: string;
  password?: string;
  general?: string;
}

/** El artículo no muestra esta entidad; se supone mínima para el caso 1.2 del Test Plan. */
export interface VerificacionEmail {
  enviado: boolean;
}
