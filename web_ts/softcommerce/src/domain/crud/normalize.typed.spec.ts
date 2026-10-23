import { describe, expect, it } from 'vitest';
import type { FieldConfig } from '../../catalogs/CatalogConfig';
import { typedNormalize } from './normalize';

const text = (normalize?: string[]): FieldConfig => ({ kind: 'text', name: 'campo', label: 'Campo', normalize });

describe('typedNormalize: the steps that act on every typed or pasted edit (R-CRUD-6, S-REF-4, S-REF-10)', () => {
  it.each([
    [['lower'], 'Info@Demo.COM', 'info@demo.com'],
    [['upper'], 'rojo', 'ROJO'],
    [['digits'], '20-12a3', '20123'],
    [['digits', 'upper'], 'ab12', '12'],
    [[], 'MiXto', 'MiXto'],
    [undefined, 'MiXto', 'MiXto'],
  ])('%j turns %s into %s', (steps, typed, shown) => {
    expect(typedNormalize(text(steps), typed)).toBe(shown);
  });

  it('keeps the spaces of an edit in progress: trimming waits for submit', () => {
    expect(typedNormalize(text(['lower']), 'Ab ')).toBe('ab ');
  });

  it('never pads while typing (padLeft happens on blur)', () => {
    expect(typedNormalize(text(['digits', 'padLeft:4']), '7')).toBe('7');
  });

  it('leaves every other kind alone', () => {
    const select: FieldConfig = { kind: 'select', name: 's', label: 'S' };
    expect(typedNormalize(select, 'X')).toBe('X');
  });
});
