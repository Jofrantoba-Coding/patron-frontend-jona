// Reconstrucción para análisis (no es el código original) de: Harol Rodriguez, "Patrón THC / THC-C", Medium, 2026-03-21,
// https://medium.com/@elbugdepajarito/patr%C3%B3n-thc-thc-c-2e7887a03921. Reproduce sus tipos y su estructura de módulos.

export interface ApiSuccessResponse<T> {
  status: 200 | 201;
  data: T;
}

export interface ApiErrorResponse {
  status: 400 | 401 | 409 | 500;
  error: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
