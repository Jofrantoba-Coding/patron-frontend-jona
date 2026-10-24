import { ApiError } from '../../services/ApiError';
import { toFailure } from '../../shared/toFailure';

/** The sentence of a refusal: the first detail of a 422 / 409 (the rule's own words), else the error message. */
export function messageOf(error: unknown): string {
  return (error instanceof ApiError && error.details[0]?.message) || toFailure(error).message;
}
