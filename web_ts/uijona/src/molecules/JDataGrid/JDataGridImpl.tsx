// JDataGridImpl.tsx — JONA Implementation
import React, { useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { nextRovingIndex } from '../../lib/roving';
import { InterJDataGrid, JDataGridHandle, JDATAGRID_DEFAULTS, JDATAGRID_PAGE_STEP } from './InterJDataGrid';
import { JDataGridView } from './JDataGridView';

function JDataGridInner<T>(props: InterJDataGrid<T>, ref: React.ForwardedRef<JDataGridHandle>) {
  const { ariaLabel, columns, rows, rowKey, selectedKey, empty, maxHeight, sort, rowState, onSelect, onOpen, onSortChange } = props;
  const baseId = useId();
  const keys = rows.map(rowKey);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const rowRefs = useRef(new Map<string, HTMLTableRowElement>());

  // A new selection from the host moves the tab stop to it.
  useEffect(() => {
    if (selectedKey != null) setActiveKey(selectedKey);
  }, [selectedKey]);

  const tabStop =
    (activeKey !== null && keys.includes(activeKey) ? activeKey : null) ??
    (selectedKey != null && keys.includes(selectedKey) ? selectedKey : null) ??
    keys[0] ??
    null;

  const focusKey = (key: string) => {
    setActiveKey(key);
    rowRefs.current.get(key)?.focus();
  };

  useImperativeHandle(ref, () => ({
    focusRow: (key?: string) => {
      const target = key ?? tabStop;
      if (target !== null && keys.includes(target)) focusKey(target);
    },
  }));

  const onKeyDown = (event: React.KeyboardEvent<HTMLTableSectionElement>) => {
    // Only keys pressed on a row; a control inside a cell keeps its keys (S-DAT-11).
    const focused = keys.find((key) => rowRefs.current.get(key) === event.target);
    if (focused === undefined) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      onOpen(focused);
      return;
    }
    const current = keys.indexOf(focused);
    const next = nextRovingIndex(current, keys.length, event.key, {
      orientation: 'vertical',
      pageStep: JDATAGRID_PAGE_STEP,
    });
    if (next === null) return;
    event.preventDefault();
    if (next === current) return;
    focusKey(keys[next]);
    onSelect(keys[next]);
  };

  return (
    <JDataGridView<T>
      ariaLabel={ariaLabel}
      columns={columns}
      rows={rows.map((row, index) => ({
        key: keys[index],
        row,
        selected: keys[index] === selectedKey,
        state: rowState?.(row) ?? {},
        badgeId: `${baseId}-badge-${index}`,
        errorId: `${baseId}-error-${index}`,
      }))}
      loading={props.loading ?? JDATAGRID_DEFAULTS.loading}
      loadingLabel={props.loadingLabel ?? JDATAGRID_DEFAULTS.loadingLabel}
      empty={empty}
      maxHeight={maxHeight}
      tabStop={tabStop}
      sort={sort}
      setRowRef={(key) => (element) => {
        if (element) rowRefs.current.set(key, element);
        else rowRefs.current.delete(key);
      }}
      onRowClick={(key) => {
        setActiveKey(key);
        onSelect(key);
      }}
      onRowDoubleClick={onOpen}
      onRowFocus={setActiveKey}
      onKeyDown={onKeyDown}
      onSortChange={onSortChange}
    />
  );
}

/** A selectable keyboard grid (D10): role=grid, one tab stop, selection follows focus. */
export const JDataGridImpl = React.forwardRef(JDataGridInner) as (<T>(
  props: InterJDataGrid<T> & { ref?: React.Ref<JDataGridHandle> },
) => React.ReactElement | null) & { displayName?: string };

JDataGridImpl.displayName = 'JDataGrid';
