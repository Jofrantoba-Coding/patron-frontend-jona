// Reconstrucción para análisis (no es el código original) de: Harol Rodriguez, "Patrón THC / THC-C", Medium, 2026-03-21,
// https://medium.com/@elbugdepajarito/patr%C3%B3n-thc-thc-c-2e7887a03921. Reproduce sus tipos y su estructura de módulos.
// El hook del artículo, sin React: el estado vive en un objeto en lugar de useState. La decisión es la misma.
// Única diferencia: `result.error` no compila (TS2339, ver test/thc-tipos.test.ts); se usa el cast que el
// propio artículo escribe en su variante con TanStack Query.
import { crearCuentaService } from '../services/composer.js';
import type { ApiErrorResponse, ApiResponse, CrearCuentaErrors, CrearCuentaFormData, Cuenta } from '../types/crearCuenta.types.js';

const initialFormData: CrearCuentaFormData = { nombre: '', email: '', password: '' };

export function useCrearCuenta() {
  const estado = {
    formData: { ...initialFormData },
    errors: {} as CrearCuentaErrors,
    status: 'idle' as 'idle' | 'loading' | 'success' | 'error',
  };

  const updateField = (field: keyof CrearCuentaFormData, value: string) => {
    estado.formData = { ...estado.formData, [field]: value };
    estado.errors = { ...estado.errors, [field]: undefined };
  };

  const registrar = async () => {
    estado.status = 'loading';
    const result: ApiResponse<Cuenta> = await crearCuentaService.registrar(estado.formData);
    if (result.status === 200 || result.status === 201) {
      estado.status = 'success';
    } else {
      estado.errors = { general: (result as ApiErrorResponse).error };
      estado.status = 'error';
    }
  };

  return { estado, updateField, registrar };
}
