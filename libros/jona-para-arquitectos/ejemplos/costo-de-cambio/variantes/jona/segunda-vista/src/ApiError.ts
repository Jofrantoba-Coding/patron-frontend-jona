/** Detalle por campo de un error de validación. `field` usa los nombres del contrato de servicio. */
export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details: ApiErrorDetail[];
  traceId: string;
}

/** Único modelo de error del servicio: lo producen el adaptador HTTP y el servicio falso por igual. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: ApiErrorDetail[];
  readonly traceId: string;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.status = status;
    this.code = body.code;
    this.details = body.details;
    this.traceId = body.traceId;
  }
}
