import { jsx as n } from "react/jsx-runtime";
import { cn as l } from "../../lib/cn.js";
const o = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl"
}, m = {
  default: "text-neutral-900",
  muted: "text-neutral-500",
  primary: "text-primary-600",
  danger: "text-danger-500",
  success: "text-success-600",
  warning: "text-warning-600"
}, p = ({
  as: t = "p",
  size: e = "base",
  color: s = "default",
  truncate: x,
  className: a,
  children: r
}) => /* @__PURE__ */ n(t, { className: l(o[e], m[s], x && "truncate", a), children: r });
export {
  p as TextAtomView
};
//# sourceMappingURL=TextAtomView.js.map
