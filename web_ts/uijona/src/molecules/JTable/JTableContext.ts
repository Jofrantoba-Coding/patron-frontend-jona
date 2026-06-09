import React, { createContext, useContext } from 'react';
import { JTABLE_DEFAULTS, JTableContextValue } from './InterJTable';

export const TableContext = createContext<JTableContextValue>({
  responsiveMode: JTABLE_DEFAULTS.responsiveMode,
  labelsRef: { current: [] },
  columnFilters: {},
  setColumnFilter: () => undefined,
});

export const useTableContext = () => useContext(TableContext);
