/** A normalize step: `upper`, `lower`, `digits` or `padLeft:n` (R-REG-2). */
export const NORMALIZE_STEP = /^(upper|lower|digits|padLeft:[1-9]\d*)$/;

/**
 * Trims a string and applies the `normalize` steps in list order. Empty stays
 * empty, other types pass through. While typing the UI passes `pad: false`
 * because `padLeft` happens on blur; the server always pads.
 * @param {unknown} value @param {string[]} [steps] @param {{ pad?: boolean }} [options]
 */
export function normalizeValue(value, steps = [], { pad = true } = {}) {
  if (typeof value !== 'string') return value;
  let out = value.trim();
  for (const step of steps) {
    if (out === '') break;
    if (step === 'upper') out = out.toUpperCase();
    else if (step === 'lower') out = out.toLowerCase();
    else if (step === 'digits') out = out.replace(/\D/g, '');
    else if (pad && step.startsWith('padLeft:')) out = out.padStart(Number(step.slice('padLeft:'.length)), '0');
  }
  return out;
}
