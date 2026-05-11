import { jsx as m } from "react/jsx-runtime";
import i from "react";
import { cn as p } from "../../lib/cn.js";
import { PANEL_ATOM_DEFAULTS as r } from "./InterPanelAtom.js";
const u = {
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
}, g = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full"
}, f = i.forwardRef(
  ({
    variant: e = r.variant,
    padding: d = r.padding,
    radius: o = r.radius,
    as: a = "div",
    className: n,
    children: t,
    ...s
  }, l) => /* @__PURE__ */ m(
    a,
    {
      ref: l,
      className: p(
        u[e],
        b[d],
        g[o],
        n
      ),
      ...s,
      children: t
    }
  )
);
f.displayName = "PanelAtomView";
export {
  f as PanelAtomView
};
//# sourceMappingURL=PanelAtomView.js.map
