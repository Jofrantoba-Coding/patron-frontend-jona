import { jsx as l } from "react/jsx-runtime";
import { cn as o } from "../../lib/cn.js";
const m = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl"
}, c = {
  default: "text-neutral-900",
  muted: "text-neutral-500",
  primary: "text-primary-600",
  danger: "text-danger-500",
  success: "text-success-600",
  warning: "text-warning-600"
}, g = ({
  as: t = "p",
  size: e = "base",
  color: s = "default",
  truncate: x,
  className: a,
  children: r,
  ...n
}) => /* @__PURE__ */ l(t, { className: o(m[e], c[s], x && "truncate", a), ...n, children: r });
export {
  g as TextAtomView
};
//# sourceMappingURL=TextAtomView.js.map
