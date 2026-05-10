import { jsx as i } from "react/jsx-runtime";
import { useState as C } from "react";
import { SWITCH_FIELD_MOLECULE_DEFAULTS as t } from "./InterSwitchFieldMolecule.js";
import { SwitchFieldMoleculeView as a } from "./SwitchFieldMoleculeView.js";
const o = (e) => {
  const [n, d] = C(
    e.checked ?? t.checked
  ), l = e.checked ?? n;
  return /* @__PURE__ */ i(
    a,
    {
      ...t,
      ...e,
      checked: l,
      onCheckedChange: (c) => {
        var h;
        d(c), (h = e.onCheckedChange) == null || h.call(e, c);
      }
    }
  );
};
o.displayName = "SwitchFieldMolecule";
export {
  o as SwitchFieldMoleculeImpl
};
//# sourceMappingURL=SwitchFieldMoleculeImpl.js.map
