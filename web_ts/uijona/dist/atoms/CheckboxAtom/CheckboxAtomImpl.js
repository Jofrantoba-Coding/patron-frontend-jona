import { jsx as f } from "react/jsx-runtime";
import a from "react";
import { CHECKBOX_ATOM_DEFAULTS as p } from "./InterCheckboxAtom.js";
import { CheckboxAtomView as i } from "./CheckboxAtomView.js";
const s = a.forwardRef(
  ({ onCheckedChange: o, ...r }, t) => {
    const m = { ...p, ...r };
    return /* @__PURE__ */ f(i, { ...m, forwardedRef: t, onChange: (e) => o == null ? void 0 : o(e.target.checked) });
  }
);
s.displayName = "CheckboxAtom";
export {
  s as CheckboxAtomImpl
};
//# sourceMappingURL=CheckboxAtomImpl.js.map
