import { createContext as e, useContext as o } from "react";
import { JTABLE_DEFAULTS as t } from "./InterJTable.js";
const r = e({
  responsiveMode: t.responsiveMode,
  labelsRef: { current: [] },
  columnFilters: {},
  setColumnFilter: () => {
  }
}), l = () => o(r);
export {
  r as TableContext,
  l as useTableContext
};
//# sourceMappingURL=JTableContext.js.map
