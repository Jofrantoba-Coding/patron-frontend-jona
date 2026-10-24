import { describe, expect, it } from 'vitest';
import type { CatalogConfig, ChildConfig } from '../../catalogs/CatalogConfig';
import { buildTabs, tabOfField } from './tabs';

const text = (name: string) => ({ kind: 'text' as const, name, label: name });
const child = (name: string): ChildConfig => ({ name, title: name.toUpperCase(), removal: 'delete', entryMode: 'dialog', config: {} as ChildConfig['config'] });
const cascade = { kind: 'cascade' as const, name: 'id_distrito', lookup: 'ubigeo' as const, levels: [{ name: 'id_departamento', label: 'Departamento' }, { name: 'id_distrito', label: 'Distrito' }], ancestorsOf: () => [] };
const config = {
  fields: [text('nombre'), cascade, text('dias')],
  layout: [{ title: 'Cobranza', fields: ['dias'] }],
  children: [child('direcciones')],
} as unknown as CatalogConfig<any>;

describe('master register tabs (R-MD-1)', () => {
  it('puts every unlisted field on General, then the layout tabs, then one tab per child', () => {
    expect(buildTabs(config).map((t) => [t.key, t.title, t.fields])).toEqual([
      ['general', 'General', ['nombre', 'id_distrito']],
      ['fields:Cobranza', 'Cobranza', ['dias']],
      ['child:direcciones', 'DIRECCIONES', []],
    ]);
  });

  it('maps a field, and a cascade level, to the tab that shows it', () => {
    const tabs = buildTabs(config);
    expect(tabOfField(tabs, config, 'nombre')).toBe('general');
    expect(tabOfField(tabs, config, 'dias')).toBe('fields:Cobranza');
    expect(tabOfField(tabs, config, 'id_departamento')).toBe('general');
  });

  it('falls back to General for a name no tab lists', () => {
    expect(tabOfField(buildTabs(config), config, 'desconocido')).toBe('general');
  });
});
