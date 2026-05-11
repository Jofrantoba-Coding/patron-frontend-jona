import { jsx as m } from "react/jsx-runtime";
import u from "react";
import { cn as p } from "../../lib/cn.js";
import { PANEL_ATOM_DEFAULTS as e } from "./InterPanelAtom.js";
const g = {
  default: "bg-white border border-neutral-200",
  outlined: "bg-transparent border border-neutral-300",
  elevated: "bg-white shadow-md border-0",
  flat: "bg-neutral-50 border-0",
  ghost: "bg-transparent border-0"
}, b = {
  none: "p-0",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8"
}, f = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full"
}, c = (r) => typeof r == "string" ? r.trim() ? r : "div" : r ?? "div", v = u.forwardRef(
  ({
    variant: r = e.variant,
    padding: o = e.padding,
    radius: n = e.radius,
    as: d,
    className: t,
    children: a,
    ...s
  }, l) => {
    const i = c(d);
    return /* @__PURE__ */ m(
      i,
      {
        ref: l,
        className: p(
          g[r],
          b[o],
          f[n],
          t
        ),
        ...s,
        children: a
      }
    );
  }
);
v.displayName = "PanelAtomView";
export {
  v as PanelAtomView
};
//# sourceMappingURL=PanelAtomView.js.map
