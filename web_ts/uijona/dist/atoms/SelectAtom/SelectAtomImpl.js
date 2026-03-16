import { jsx as l } from "react/jsx-runtime";
import d from "react";
import { SELECT_ATOM_DEFAULTS as c } from "./InterSelectAtom.js";
import { SelectAtomView as f } from "./SelectAtomView.js";
const p = d.forwardRef(
  ({ onChange: t, onBlur: r, ...m }, o) => {
    const a = { ...c, ...m };
    return /* @__PURE__ */ l(
      f,
      {
        ...a,
        forwardedRef: o,
        onChange: (e) => t == null ? void 0 : t(e.target.value, e),
        onBlur: (e) => r == null ? void 0 : r(e.target.value, e)
      }
    );
  }
);
p.displayName = "SelectAtom";
export {
  p as SelectAtomImpl
};
//# sourceMappingURL=SelectAtomImpl.js.map
