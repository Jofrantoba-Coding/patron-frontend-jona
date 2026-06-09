// JDataTableImpl.tsx — JONA Implementation
import React, { useMemo, useState } from 'react';
import { InterJDataTable, JDATA_TABLE_DEFAULTS, JDataTableSort } from './InterJDataTable';
import { JDataTableView } from './JDataTableView';

export function JDataTableImpl<T = Record<string, unknown>>(props: InterJDataTable<T>) {
  const merged = { ...JDATA_TABLE_DEFAULTS, ...props };

  // Uncontrolled sort state (overridden by props.sort if provided)
  const [internalSort, setInternalSort] = useState<JDataTableSort | undefined>(undefined);
  const [internalFilter, setInternalFilter] = useState('');

  const sort = props.sort ?? internalSort;
  const filterValue = props.filterValue ?? internalFilter;

  const handleSortChange = (next: JDataTableSort) => {
    setInternalSort(next.direction === null ? undefined : next);
    props.onSortChange?.(next);
  };

  const handleFilterChange = (value: string) => {
    setInternalFilter(value);
    props.onFilterChange?.(value);
  };

  // Client-side filtering (when not controlled externally)
  const filtered = useMemo(() => {
    if (props.filterValue !== undefined || !filterValue.trim()) return props.data;
    const q = filterValue.toLowerCase();
    return props.data.filter((row) =>
      props.columns.some((col) => {
        const val = (row as Record<string, unknown>)[col.key];
        return String(val ?? '').toLowerCase().includes(q);
      })
    );
  }, [props.data, props.columns, filterValue, props.filterValue]);

  // Client-side sorting (when not controlled externally)
  const sorted = useMemo(() => {
    if (props.sort !== undefined || !sort || sort.direction === null) return filtered;
    const col = props.columns.find((c) => c.key === sort.key);
    if (!col) return filtered;
    return [...filtered].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sort.key];
      const bv = (b as Record<string, unknown>)[sort.key];
      const aStr = String(av ?? '');
      const bStr = String(bv ?? '');
      const cmp = isNaN(Number(aStr)) ? aStr.localeCompare(bStr) : Number(aStr) - Number(bv);
      return sort.direction === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sort, props.columns, props.sort]);

  return (
    <JDataTableView
      columns={props.columns}
      rows={sorted}
      rowKey={props.rowKey}
      sort={sort}
      loading={merged.loading}
      emptyTitle={merged.emptyTitle}
      emptyDescription={merged.emptyDescription}
      filterValue={filterValue}
      filterPlaceholder={merged.filterPlaceholder}
      showFilter={merged.showFilter}
      stickyHeader={merged.stickyHeader}
      className={props.className}
      onSortChange={handleSortChange}
      onFilterChange={handleFilterChange}
      onRowClick={props.onRowClick}
    />
  );
}

JDataTableImpl.displayName = 'JDataTable';
