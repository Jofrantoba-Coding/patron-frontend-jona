import { jsx as r } from "react/jsx-runtime";
import e from "react";
import { INPUT_ATOM_DEFAULTS as u } from "./InterInputAtom.js";
import { InputAtomView as h } from "./InputAtomView.js";
const v = e.forwardRef(
  ({ onChange: a, onBlur: m, onKeyDown: d, onEnterPress: p, onClear: f, ...c }, i) => {
    const l = { ...u, ...c };
    return /* @__PURE__ */ r(
      h,
      {
        ...l,
        forwardedRef: i,
        onChange: (t) => a == null ? void 0 : a(t.target.value, t),
        onBlur: (t) => m == null ? void 0 : m(t.target.value, t),
        onKeyDown: (t) => {
          t.key === "Enter" && (p == null || p(t.target.value, t)), t.key === "Backspace" && t.target.value === "" && (f == null || f()), d == null || d(t);
        }
      }
    );
  }
);
v.displayName = "InputAtom";
export {
  v as InputAtomImpl
};
//# sourceMappingURL=InputAtomImpl.js.map
