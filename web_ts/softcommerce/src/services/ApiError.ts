/** Per-field validation detail carried by `ApiError.details`. */
export interface ApiErrorDetail {
  field: string;
  message: string;
}

/** Wire shape of every API error body: `{ code, message, details, traceId }`. */
export interface ApiErrorBody {
  code: string;
  message: string;
  details: ApiErrorDetail[];
  traceId: string;
}

/** Error raised by both the http client and the mock services (same shape in either mode). */
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

function isErrorBody(value: unknown): value is Partial<ApiErrorBody> & { message: string; code: string } {
  const body = value as Record<string, unknown> | null;
  return typeof body === 'object' && body !== null
    && typeof body.code === 'string' && typeof body.message === 'string';
}

/** Builds an ApiError from a parsed response body, falling back to a generic one. */
export function toApiError(status: number, body: unknown, fallbackTraceId: string): ApiError {
  if (isErrorBody(body)) {
    return new ApiError(status, {
      code: body.code,
      message: body.message,
      details: Array.isArray(body.details) ? body.details : [],
      traceId: typeof body.traceId === 'string' ? body.traceId : fallbackTraceId,
    });
  }
  return new ApiError(status, {
    code: 'HTTP_ERROR',
    message: `Request failed with status ${status}`,
    details: [],
    traceId: fallbackTraceId,
  });
}
