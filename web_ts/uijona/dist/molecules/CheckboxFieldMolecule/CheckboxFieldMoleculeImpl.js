import { jsx as l } from "react/jsx-runtime";
import { useState as o } from "react";
import { CHECKBOX_FIELD_MOLECULE_DEFAULTS as n } from "./InterCheckboxFieldMolecule.js";
import { CheckboxFieldMoleculeView as k } from "./CheckboxFieldMoleculeView.js";
const a = (e) => {
  const [C, d] = o(
    e.checked ?? n.checked
  ), t = e.checked ?? C;
  return /* @__PURE__ */ l(
    k,
    {
      ...n,
      ...e,
      checked: t,
      onCheckedChange: (c) => {
        var h;
        d(c), (h = e.onCheckedChange) == null || h.call(e, c);
      }
    }
  );
};
a.displayName = "CheckboxFieldMolecule";
export {
  a as CheckboxFieldMoleculeImpl
};
//# sourceMappingURL=CheckboxFieldMoleculeImpl.js.map
