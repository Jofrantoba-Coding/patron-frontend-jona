import { describe, expect, it } from 'vitest';
import { withParamTokens } from '../../catalogs/paramTokens';
import type { FieldConfig } from '../../catalogs/CatalogConfig';
import { changeField } from './conditional';

/** D27b on the form: an edit of the source sets the fields that follow it; the session `$params.X` tokens are resolved before. */
const fields = [
  { kind: 'select', name: 'stock', label: 'Stock', source: { catalog: 'u' } },
  { kind: 'select', name: 'compra', label: 'Compra', source: { catalog: 'u' }, follows: { field: 'stock' } },
  { kind: 'options', name: 'afecto', label: 'Afecto', options: [{ value: 'AFECTO', label: 'A' }], display: 'select' },
  { kind: 'number', name: 'igv', label: 'IGV', scale: 2, follows: { field: 'afecto', map: { AFECTO: '$params.PORC_IGV' }, otherwise: 0 } },
  { kind: 'boolean', name: 'kardex', label: 'K', follows: { field: 'afecto', map: { AFECTO: true }, otherwise: false } },
  { kind: 'options', name: 'perecible', label: 'P', default: 'N', display: 'radio', options: [{ value: 'S', label: 'S' }, { value: 'N', label: 'N' }] },
  { kind: 'options', name: 'tipo', label: 'T', display: 'select', options: [{ value: 'P', label: 'P' }], clearsOnChange: ['perecible'] },
] as FieldConfig[];
const resolved = fields.map((field) => withParamTokens(field, { PORC_IGV: 18 }));

describe('changeField follows', () => {
  it('copies the source into a plain follower and lists it as cleared (its error goes away)', () => {
    expect(changeField(resolved, { stock: '', compra: '' }, 'stock', '002')).toEqual({ values: { stock: '002', compra: '002' }, cleared: ['compra'] });
  });

  it('maps the source text to a value shown as text, a `$params.X` token as the session parameter and the otherwise for any other', () => {
    expect(changeField(resolved, {}, 'afecto', 'AFECTO').values).toMatchObject({ igv: '18', kardex: 'true' });
    expect(changeField(resolved, {}, 'afecto', 'INAFECTO').values).toMatchObject({ igv: '0', kardex: 'false' });
  });

  it('clearsOnChange restores the starting value of an options field that declares one', () => {
    expect(changeField(resolved, { perecible: 'S' }, 'tipo', 'P').values.perecible).toBe('N');
  });
});

describe('withParamTokens', () => {
  it('resolves a default token to text and leaves a field with no token as the same value', () => {
    const igv = { kind: 'number', name: 'igv', label: 'IGV', scale: 2, default: '$params.PORC_IGV' } as FieldConfig;
    expect((withParamTokens(igv, { PORC_IGV: 18 }) as { default: string }).default).toBe('18');
    expect((withParamTokens(igv, undefined) as { default: string }).default).toBe('');
    expect(withParamTokens(fields[0], { PORC_IGV: 18 })).toEqual(fields[0]);
  });
});
