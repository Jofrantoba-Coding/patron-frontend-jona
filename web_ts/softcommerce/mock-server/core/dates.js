/**
 * Date rules shared by the server validators and the UI (R-CRUD-11): the wire carries ISO `yyyy-MM-dd`, the screen
 * shows `dd/MM/yyyy`. Calendar dates only, no time zone: a date is its own year, month and day.
 */

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;
const DISPLAY = /^(\d{2})\/(\d{2})\/(\d{4})$/;

/** True when the parts name a real calendar day (no 31 February, no month 13). @param {number} y @param {number} m @param {number} d */
function isRealDay(y, m, d) {
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

/** A real `yyyy-MM-dd` date. @param {unknown} text */
export function isIsoDate(text) {
  const match = typeof text === 'string' ? ISO.exec(text) : null;
  return match !== null && isRealDay(Number(match[1]), Number(match[2]), Number(match[3]));
}

/** A typed `dd/MM/yyyy` as ISO, or null when it is not a real date (incomplete, impossible, other format). @param {string} text */
export function displayToIso(text) {
  const match = DISPLAY.exec(String(text ?? '').trim());
  if (!match || !isRealDay(Number(match[3]), Number(match[2]), Number(match[1]))) return null;
  return `${match[3]}-${match[2]}-${match[1]}`;
}

/** An ISO date as `dd/MM/yyyy`; anything else is empty. @param {unknown} iso */
export function isoToDisplay(iso) {
  if (!isIsoDate(iso)) return '';
  const [y, m, d] = /** @type {string} */ (iso).split('-');
  return `${d}/${m}/${y}`;
}

/** The local calendar date of `now` as ISO (the desktop `new Date()`, not the UTC day). @param {Date} [now] */
export function todayIso(now = new Date()) {
  const pad = (/** @type {number} */ n, width = 2) => String(n).padStart(width, '0');
  return `${pad(now.getFullYear(), 4)}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
