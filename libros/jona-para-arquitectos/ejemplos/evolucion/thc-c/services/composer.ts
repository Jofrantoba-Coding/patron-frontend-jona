// Reconstrucción para análisis (no es el código original) de: Harol Rodriguez, "Patrón THC / THC-C", Medium, 2026-03-21,
// https://medium.com/@elbugdepajarito/patr%C3%B3n-thc-thc-c-2e7887a03921. Reproduce sus tipos y su estructura de módulos.
// Composer de la variante B: importa los dos servicios de forma estática y elige uno.
import { composeConfig } from '../composeConfig.js';
import { crearCuentaService as real } from './crearCuentaService.js';
import { crearCuentaService as mock } from './crearCuentaService.mock.js';

export const crearCuentaService = composeConfig.register.useMock ? mock : real;
