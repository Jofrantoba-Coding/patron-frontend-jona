import { jsx as i } from "react/jsx-runtime";
import d from "react";
import { RADIO_ATOM_DEFAULTS as f } from "./InterRadioAtom.js";
import { RadioAtomView as l } from "./RadioAtomView.js";
const p = d.forwardRef(
  ({ onCheckedChange: r, ...a }, m) => {
    const t = { ...f, ...a };
    return /* @__PURE__ */ i(l, { ...t, forwardedRef: m, onChange: (o) => {
      t.disabled || r == null || r(o.target.checked, o.target.value, o);
    } });
  }
);
p.displayName = "RadioAtom";
export {
  p as RadioAtomImpl
};
//# sourceMappingURL=RadioAtomImpl.js.map
