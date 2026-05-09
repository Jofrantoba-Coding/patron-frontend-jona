import { jsx as n } from "react/jsx-runtime";
import p from "react";
import { ButtonAtomImpl as a } from "../ButtonAtom/ButtonAtomImpl.js";
const c = p.forwardRef(
  ({ icon: t, label: m, variant: r = "ghost", loading: o, ...e }, i) => /* @__PURE__ */ n(a, { ref: i, type: "button", size: "icon", variant: r, loading: o, "aria-label": m, ...e, children: !o && t })
);
c.displayName = "IconButtonAtomView";
export {
  c as IconButtonAtomView
};
//# sourceMappingURL=IconButtonAtomView.js.map
