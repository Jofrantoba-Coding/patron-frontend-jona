// Reconstrucción para análisis (no es el código original) de: Harol Rodriguez, "Patrón THC / THC-C", Medium, 2026-03-21,
// https://medium.com/@elbugdepajarito/patr%C3%B3n-thc-thc-c-2e7887a03921. Reproduce sus tipos y su estructura de módulos.
// Servicio real: devuelve el cuerpo de la respuesta tal cual, tipado como ApiResponse<Cuenta>.
import type { ApiResponse, CrearCuentaFormData, Cuenta } from '../types/crearCuenta.types.js';

export const crearCuentaService = {
  registrar: async (data: CrearCuentaFormData): Promise<ApiResponse<Cuenta>> => {
    const response = await fetch('/api/crear-cuenta', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
