import { validationError } from './errors.js';

/**
 * @typedef {{ required: string[], maxLength: Record<string, number> }} ValidationRules
 * @typedef {{ empresaIds: string[], districtIds: string[] }} ValidationLookups
 */

/**
 * Pure record validation. Returns per-field details in a stable order:
 * required fields first, then length-limited fields.
 * @param {ValidationRules} rules
 * @param {Record<string, any>} record
 * @param {ValidationLookups} lookups
 * @returns {{ field: string, message: string }[]}
 */
export function collectViolations(rules, record, lookups) {
  /** @type {{ field: string, message: string }[]} */
  const details = [];
  for (const field of rules.required) {
    if (String(record[field] ?? '').trim() === '') {
      details.push({ field, message: `${field} is required` });
    }
  }
  for (const [field, max] of Object.entries(rules.maxLength)) {
    if (String(record[field] ?? '').length > max) {
      details.push({ field, message: `${field} must be at most ${max} characters` });
    }
  }
  const empresa = String(record.id_empresa ?? '');
  if (empresa !== '' && !lookups.empresaIds.includes(empresa)) {
    details.push({ field: 'id_empresa', message: 'id_empresa does not exist' });
  }
  const ubigeo = String(record.id_ubigeo ?? '');
  if (ubigeo !== '' && !lookups.districtIds.includes(ubigeo)) {
    details.push({ field: 'id_ubigeo', message: 'id_ubigeo must be an existing distrito' });
  }
  const order = rules.required.concat(Object.keys(rules.maxLength));
  return details.sort((a, b) => order.indexOf(a.field) - order.indexOf(b.field));
}

/**
 * @param {ValidationRules} rules
 * @param {Record<string, any>} record
 * @param {ValidationLookups} lookups
 */
export function assertValid(rules, record, lookups) {
  const details = collectViolations(rules, record, lookups);
  if (details.length > 0) throw validationError(details);
}

/**
 * Parses a positive integer query value, falling back when invalid.
 * @param {unknown} raw @param {number} fallback @param {number} [max]
 */
export function positiveInt(raw, fallback, max = Number.MAX_SAFE_INTEGER) {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? Math.min(n, max) : fallback;
}
