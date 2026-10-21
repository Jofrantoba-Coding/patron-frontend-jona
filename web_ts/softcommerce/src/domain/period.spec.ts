import { describe, expect, it } from 'vitest';
import {
  isEndNotBeforeStart,
  isOnOrAfterActivityStart,
  isSameAccountingYear,
  isValidIsoDate,
  validatePeriod,
} from './period';

const INICIO_ACTIVIDADES = '2020-01-01';
const period = (fechaInicio: string, fechaFin: string) => ({ fechaInicio, fechaFin, inicioActividades: INICIO_ACTIVIDADES });

describe('independent period rules', () => {
  it('isValidIsoDate accepts real calendar days and rejects impossible or empty ones', () => {
    expect(isValidIsoDate('2026-02-28')).toBe(true);
    expect(isValidIsoDate('2024-02-29')).toBe(true);
    expect(isValidIsoDate('2026-02-31')).toBe(false);
    expect(isValidIsoDate('31/02/2026')).toBe(false);
    expect(isValidIsoDate('')).toBe(false);
  });

  it('isOnOrAfterActivityStart includes the boundary day', () => {
    expect(isOnOrAfterActivityStart('2020-01-01', INICIO_ACTIVIDADES)).toBe(true);
    expect(isOnOrAfterActivityStart('2019-12-31', INICIO_ACTIVIDADES)).toBe(false);
  });

  it('isEndNotBeforeStart accepts the same day and rejects an earlier end', () => {
    expect(isEndNotBeforeStart('2026-06-01', '2026-06-01')).toBe(true);
    expect(isEndNotBeforeStart('2026-06-01', '2026-05-31')).toBe(false);
  });

  it('isSameAccountingYear compares the year of both dates', () => {
    expect(isSameAccountingYear('2026-01-01', '2026-12-31')).toBe(true);
    expect(isSameAccountingYear('2025-12-01', '2026-01-31')).toBe(false);
  });
});

describe('validatePeriod', () => {
  it('S-AUTH-11 reports INVALID_DATE for an impossible or empty date, in either field', () => {
    expect(validatePeriod(period('2026-02-31', '2026-03-01'))).toBe('INVALID_DATE');
    expect(validatePeriod(period('', '2026-03-01'))).toBe('INVALID_DATE');
    expect(validatePeriod(period('2026-03-01', ''))).toBe('INVALID_DATE');
  });

  it('S-AUTH-12 reports BEFORE_ACTIVITY_START when inicio precedes INICIO_ACTIVIDADES', () => {
    expect(validatePeriod(period('2019-12-31', '2019-12-31'))).toBe('BEFORE_ACTIVITY_START');
  });

  it('S-AUTH-13 reports END_BEFORE_START', () => {
    expect(validatePeriod(period('2026-06-01', '2026-05-31'))).toBe('END_BEFORE_START');
  });

  it('S-AUTH-14 reports DIFFERENT_YEAR for a valid ordered range across years', () => {
    expect(validatePeriod(period('2025-12-01', '2026-01-31'))).toBe('DIFFERENT_YEAR');
  });

  it('S-AUTH-15 accepts inicio equal to INICIO_ACTIVIDADES with fin on the same day', () => {
    expect(validatePeriod(period('2020-01-01', '2020-01-01'))).toBeNull();
  });

  it('accepts an ordinary range inside one year', () => {
    expect(validatePeriod(period('2026-01-01', '2026-12-31'))).toBeNull();
  });
});
