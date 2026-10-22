/**
 * Transport-agnostic error type for the mock core. The HTTP layer adds the
 * `traceId` (equal to the response correlation id); the core never invents one.
 */

/** @typedef {{ field: string, message: string }} FieldDetail */

export class MockError extends Error {
  /**
   * @param {number} status HTTP status the transport layer should use.
   * @param {string} code Stable machine-readable code.
   * @param {string} message Human-readable message.
   * @param {FieldDetail[]} [details] Per-field details (validation errors).
   */
  constructor(status, code, message, details = []) {
    super(message);
    this.name = 'MockError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/** @param {string} message */
export const notFound = (message) => new MockError(404, 'NOT_FOUND', message);

/** @param {FieldDetail[]} details */
export const validationError = (details) =>
  new MockError(422, 'VALIDATION_ERROR', 'Validation failed', details);

/**
 * Builds the public error body `{ code, message, details, traceId }`.
 * @param {unknown} error
 * @param {string} traceId
 */
export function toErrorBody(error, traceId) {
  if (error instanceof MockError) {
    return { code: error.code, message: error.message, details: error.details, traceId };
  }
  return { code: 'INTERNAL_ERROR', message: 'Unexpected server error', details: [], traceId };
}
