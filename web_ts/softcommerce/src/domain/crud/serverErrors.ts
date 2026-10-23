import { ApiError } from '../../services/ApiError';
import { toFailure, type Failure } from '../../shared/toFailure';

export interface MappedServerError {
  /** Field name -> message, one per field named by the response. */
  fields: Record<string, string>;
  /** The first named field in config order: the one to focus. */
  first?: string;
  /** What is left for the form-level alert: unknown fields, or an error without field details. */
  form?: Failure;
}

/**
 * Maps a failed execute to the form (R-CRUD-7, S-CRUD-38). A 409 or 422 whose `details` name form
 * fields shows each message under its field; details naming unknown fields and errors without
 * usable details stay form-level.
 */
export function mapServerError(error: unknown, fieldOrder: readonly string[]): MappedServerError {
  const mappable = error instanceof ApiError && (error.status === 409 || error.status === 422) && error.details.length > 0;
  if (!mappable) return { fields: {}, form: toFailure(error) };
  const fields: Record<string, string> = {};
  const unknown: string[] = [];
  for (const { field, message } of error.details) {
    if (!fieldOrder.includes(field)) unknown.push(message);
    else if (!(field in fields)) fields[field] = message;
  }
  const first = fieldOrder.find((name) => name in fields);
  return {
    fields,
    ...(first ? { first } : {}),
    ...(unknown.length > 0 ? { form: { message: unknown.join(' '), traceId: error.traceId } } : {}),
  };
}
