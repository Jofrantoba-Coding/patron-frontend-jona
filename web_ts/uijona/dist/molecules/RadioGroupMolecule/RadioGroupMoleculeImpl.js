import { jsx as r } from "react/jsx-runtime";
import { useState as i } from "react";
import { RADIO_GROUP_MOLECULE_DEFAULTS as p } from "./InterRadioGroupMolecule.js";
import { RadioGroupMoleculeView as m } from "./RadioGroupMoleculeView.js";
const c = (l) => {
  const e = { ...p, ...l }, [n, t] = i(e.defaultValue), u = e.value ?? n;
  return /* @__PURE__ */ r(
    m,
    {
      ...e,
      selectedValue: u,
      onOptionChange: (a) => {
        var o;
        e.value === void 0 && t(a.value), (o = e.onValueChange) == null || o.call(e, a.value, a);
      }
    }
  );
};
c.displayName = "RadioGroupMolecule";
export {
  c as RadioGroupMoleculeImpl
};
//# sourceMappingURL=RadioGroupMoleculeImpl.js.map
