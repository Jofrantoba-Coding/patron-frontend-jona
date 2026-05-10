import { jsx as f } from "react/jsx-runtime";
import i, { useState as s } from "react";
import { CHECKBOX_ATOM_DEFAULTS as n } from "./InterCheckboxAtom.js";
import { CheckboxAtomView as h } from "./CheckboxAtomView.js";
const l = i.forwardRef(
  ({ onCheckedChange: e, ...r }, o) => {
    const t = { ...n, ...r }, [d, m] = s(t.checked), a = r.checked ?? d;
    return /* @__PURE__ */ f(
      h,
      {
        ...t,
        checked: a,
        forwardedRef: o,
        onChange: (c) => {
          t.disabled || (m(c.target.checked), e == null || e(c.target.checked));
        }
      }
    );
  }
);
l.displayName = "CheckboxAtom";
export {
  l as CheckboxAtomImpl
};
//# sourceMappingURL=CheckboxAtomImpl.js.map
