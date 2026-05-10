import { useContext as e, createContext as o } from "react";
import { TABLE_MOLECULE_DEFAULTS as t } from "./InterTableMolecule.js";
const r = o({
  responsiveMode: t.responsiveMode,
  labelsRef: { current: [] }
}), p = () => e(r);
export {
  r as TableContext,
  p as useTableContext
};
//# sourceMappingURL=TableMoleculeContext.js.map
