import { ApiError } from '../../services/ApiError';
import { toFailure, type Failure } from '../../shared/toFailure';

/** A failure of one child row: `<child>[<n>].<field>`, `n` being the index in the array SENT for that child (R-MOCK-19). */
export interface ChildServerError {
  child: string;
  index: number;
  field: string;
  message: string;
}

const CHILD_DETAIL = /^([\w-]+)\[(\d+)\]\.(.+)$/;

export interface MappedServerError {
  /** Field name -> message, one per field named by the response. */
  fields: Record<string, string>;
  /** The first named field in config order: the one to focus. */
  first?: string;
  /** The child rows the server rejected, in the order it named them; absent when none. */
  children?: ChildServerError[];
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
  const children: ChildServerError[] = [];
  for (const { field, message } of error.details) {
    const child = CHILD_DETAIL.exec(field);
    if (child) children.push({ child: child[1], index: Number(child[2]), field: child[3], message });
    else if (!fieldOrder.includes(field)) unknown.push(message);
    else if (!(field in fields)) fields[field] = message;
  }
  const first = fieldOrder.find((name) => name in fields);
  return {
    fields,
    ...(first ? { first } : {}),
    ...(children.length > 0 ? { children } : {}),
    ...(unknown.length > 0 ? { form: { message: unknown.join(' '), traceId: error.traceId } } : {}),
  };
}
