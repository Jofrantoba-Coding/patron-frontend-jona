// Reconstrucción para análisis (no es el código original) de: Harol Rodriguez, "Patrón THC / THC-C", Medium, 2026-03-21,
// https://medium.com/@elbugdepajarito/patr%C3%B3n-thc-thc-c-2e7887a03921. Reproduce sus tipos y su estructura de módulos.
// Mock: carga el fixture del escenario configurado y lo devuelve. El artículo escribe la ruta sin extensión y con el
// alias @/; con esbuild ese patrón no encuentra archivos (empty-glob), por eso aquí va relativa y con .ts.
import { composeConfig } from '../composeConfig.js';
import type { ApiResponse, CrearCuentaFormData, Cuenta } from '../types/crearCuenta.types.js';

const { scenario } = composeConfig.register;

export const crearCuentaService = {
  registrar: async (_data: CrearCuentaFormData): Promise<ApiResponse<Cuenta>> => {
    const { default: fixture } = await import(`../fixtures/${scenario}/crearCuenta.fixture.ts`);
    return fixture;
  },
};
