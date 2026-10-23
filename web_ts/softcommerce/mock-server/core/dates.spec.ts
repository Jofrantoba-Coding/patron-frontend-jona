import { describe, expect, it } from 'vitest';
import { displayToIso, isIsoDate, isoToDisplay, todayIso } from './dates.js';

describe('shared date helpers (R-CRUD-11: dd/MM/yyyy on screen, yyyy-MM-dd on the wire)', () => {
  it.each([
    ['2026-01-15', true],
    ['2024-02-29', true],
    ['2026-02-31', false],
    ['2025-02-29', false],
    ['2026-13-01', false],
    ['15/01/2026', false],
    ['', false],
    ['2026-01-15T00:00', false],
  ])('isIsoDate(%s) is %s', (text, valid) => {
    expect(isIsoDate(text)).toBe(valid);
  });

  it.each([
    ['15/01/2026', '2026-01-15'],
    [' 05/12/1999 ', '1999-12-05'],
    ['29/02/2024', '2024-02-29'],
    ['31/02/2026', null],
    ['29/02/2025', null],
    ['15/01/____', null],
    ['', null],
    ['2026-01-15', null],
  ])('displayToIso(%s) is %s', (text, iso) => {
    expect(displayToIso(text)).toBe(iso);
  });

  it('shows an ISO date as dd/MM/yyyy and anything else as empty', () => {
    expect(isoToDisplay('2026-01-05')).toBe('05/01/2026');
    expect(isoToDisplay('2026-02-31')).toBe('');
    expect(isoToDisplay(undefined)).toBe('');
  });

  it('today is the local calendar date, not the UTC one', () => {
    expect(todayIso(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
    expect(todayIso(new Date(2026, 11, 31, 0, 0))).toBe('2026-12-31');
  });
});
