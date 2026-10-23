export type SortDirection = 'asc' | 'desc';

export interface SortState<K extends string = string> {
  key: K;
  direction: SortDirection;
}

/** Where the list formatter keeps the sortable ISO value of a date column. */
export const sortKeyOf = (key: string) => `${key}__iso`;

const collator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });

/** Rows whose given columns contain `text` (case-insensitive); blank text keeps every row. */
export function filterRows<T>(rows: readonly T[], text: string, keys: readonly (keyof T)[]): T[] {
  const needle = text.trim().toLowerCase();
  if (needle === '') return [...rows];
  return rows.filter((row) => keys.some((key) => String(row[key] ?? '').toLowerCase().includes(needle)));
}

/** Sorted copy by one column; without a sort the order is kept. */
export function sortRows<T>(rows: readonly T[], sort: SortState<string> | undefined): T[] {
  if (!sort) return [...rows];
  const sign = sort.direction === 'asc' ? 1 : -1;
  // A date column shows dd/MM/yyyy but sorts by its ISO value (the formatter keeps it beside the text).
  const valueOf = (row: T) => String((row as Record<string, unknown>)[sortKeyOf(sort.key)] ?? (row as Record<string, unknown>)[sort.key] ?? '');
  return [...rows].sort((a, b) => sign * collator.compare(valueOf(a), valueOf(b)));
}

/** Header click: a new column starts ascending, the same column toggles ascending and descending. */
export function nextSort<K extends string>(current: SortState<K> | undefined, key: K): SortState<K> {
  const direction: SortDirection = current?.key === key && current.direction === 'asc' ? 'desc' : 'asc';
  return { key, direction };
}
