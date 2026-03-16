import { jsx as f } from "react/jsx-runtime";
import a from "react";
import { CHECKBOX_ATOM_DEFAULTS as i } from "./InterCheckboxAtom.js";
import { CheckboxAtomView as p } from "./CheckboxAtomView.js";
const s = a.forwardRef(
  ({ onCheckedChange: r, ...t }, m) => {
    const o = { ...i, ...t };
    return /* @__PURE__ */ f(p, { ...o, forwardedRef: m, onChange: (e) => {
      o.disabled || r == null || r(e.target.checked);
    } });
  }
);
s.displayName = "CheckboxAtom";
export {
  s as CheckboxAtomImpl
};
//# sourceMappingURL=CheckboxAtomImpl.js.map
