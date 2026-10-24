// The `$params.X` value tokens of a field (D27b) resolved against the session company params: the `default` (or each per-mode default) and the values of `follows`. Pure.
import { paramToken, resolveParamToken } from '../../mock-server/core/predicates.js';
import type { FieldConfig } from './CatalogConfig';

type Params = Record<string, unknown> | undefined;
/** A token becomes the parameter as text (a form value); any other value stays as it is. */
const resolved = (value: unknown, params: Params) => (paramToken(value) === undefined ? value : String(resolveParamToken(value, params) ?? ''));

/** The field with its tokens replaced by the session parameters (the same field when it names none). */
export function withParamTokens<F extends FieldConfig>(field: F, params: Params): F {
  const out: Record<string, any> = { ...field };
  if (typeof out.default === 'string') out.default = resolved(out.default, params);
  if (out.follows?.map) out.follows = { ...out.follows, map: Object.fromEntries(Object.entries(out.follows.map).map(([key, value]) => [key, resolved(value, params)])), otherwise: resolved(out.follows.otherwise, params) };
  return out as F;
}
