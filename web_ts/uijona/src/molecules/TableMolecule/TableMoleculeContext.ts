import React, { createContext, useContext } from 'react';
import { TABLE_MOLECULE_DEFAULTS, TableContextValue } from './InterTableMolecule';

export const TableContext = createContext<TableContextValue>({
  responsiveMode: TABLE_MOLECULE_DEFAULTS.responsiveMode,
  labelsRef: { current: [] },
});

export const useTableContext = () => useContext(TableContext);
