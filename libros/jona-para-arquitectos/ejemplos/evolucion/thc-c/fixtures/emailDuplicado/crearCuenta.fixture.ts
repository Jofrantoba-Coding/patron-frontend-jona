// Reconstrucción para análisis (no es el código original) de: Harol Rodriguez, "Patrón THC / THC-C", Medium, 2026-03-21,
// https://medium.com/@elbugdepajarito/patr%C3%B3n-thc-thc-c-2e7887a03921. Reproduce sus tipos y su estructura de módulos.
import type { ApiResponse, Cuenta } from '../../types/crearCuenta.types.js';

const fixture: ApiResponse<Cuenta> = {
  status: 409,
  error: 'Este email ya está registrado',
  code: 'EMAIL_DUPLICADO',
};

export default fixture;
