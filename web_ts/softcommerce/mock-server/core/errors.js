/**
 * Transport-agnostic error type for the mock core. The HTTP layer adds the
 * `traceId` (equal to the response correlation id); the core never invents one.
 */

/** @typedef {{ field: string, message: string, code?: string }} FieldDetail */

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

/** A unique-key violation (R-MOCK-11). @param {FieldDetail[]} details */
export const duplicateError = (details) => new MockError(409, 'DUPLICATE', 'Duplicate record', details);

/** A row action the state of the row does not allow (R-MOCK-22); the message is the rule's own. @param {string} message */
export const actionNotAllowed = (message) => new MockError(409, 'ACTION_NOT_ALLOWED', message);

/** A write outside the entry `modes` (R-MOCK-17). @param {string} message */
export const modeNotSupported = (message) => new MockError(405, 'MODE_NOT_SUPPORTED', message);

/** A write to a read-only lookup (R-MOCK-15). @param {string} message */
export const methodNotAllowed = (message) => new MockError(405, 'METHOD_NOT_ALLOWED', message);

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
