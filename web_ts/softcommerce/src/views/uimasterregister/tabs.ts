// Pure: the tabs of a master register and the tab that owns a field (R-MD-1).
import type { CatalogConfig, ChildConfig } from '../../catalogs/CatalogConfig';

export interface RegisterTab {
  key: string;
  title: string;
  /** The parent fields on the tab, in declared order; empty on a child tab. */
  fields: string[];
  child?: ChildConfig;
}

/** `General` first (it holds every field no layout tab lists), then the layout tabs, then one tab per child. */
export function buildTabs(config: CatalogConfig<any>): RegisterTab[] {
  const layout = config.layout ?? [];
  const placed = new Set(layout.flatMap((tab) => tab.fields));
  return [
    { key: 'general', title: 'General', fields: config.fields.map((field) => field.name).filter((name) => !placed.has(name)) },
    ...layout.map((tab) => ({ key: `fields:${tab.title}`, title: tab.title, fields: tab.fields })),
    ...(config.children ?? []).map((child) => ({ key: `child:${child.name}`, title: child.title, fields: [], child })),
  ];
}

/** The key of the tab that shows the field; a cascade level belongs to the tab of its cascade. */
export function tabOfField(tabs: RegisterTab[], config: CatalogConfig<any>, name: string): string {
  const owner = config.fields.find((field) => field.name === name || (field.kind === 'cascade' && field.levels.some((level) => level.name === name)));
  return (tabs.find((tab) => tab.fields.includes(owner?.name ?? name)) ?? tabs[0]).key;
}
