import { jsx as r } from "react/jsx-runtime";
import { cn as o } from "../lib/cn.js";
const m = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl font-semibold"
}, c = {
  default: "text-neutral-900",
  muted: "text-neutral-500",
  danger: "text-danger-500",
  success: "text-success-500",
  primary: "text-primary-600"
}, d = ({ as: t = "p", size: e = "base", color: s = "default", className: x, children: a, ...l }) => /* @__PURE__ */ r(t, { className: o(m[e], c[s], x), ...l, children: a });
export {
  d as TextAtom
};
//# sourceMappingURL=TextAtom.js.map
