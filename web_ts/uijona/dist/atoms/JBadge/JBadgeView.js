import { jsx as s } from "react/jsx-runtime";
import { cn as d } from "../../lib/cn.js";
const l = {
  default: "bg-primary-600 text-white border-transparent",
  secondary: "bg-neutral-200 text-neutral-700 border-transparent",
  destructive: "bg-danger-500 text-white border-transparent",
  outline: "bg-transparent text-neutral-700 border-neutral-300",
  ghost: "bg-neutral-100 text-neutral-600 border-transparent"
}, p = ({
  variant: t = "default",
  className: e,
  style: r,
  children: a,
  forwardedRef: n,
  ...o
}) => /* @__PURE__ */ s(
  "span",
  {
    ref: n,
    "data-jbadge-variant": t,
    className: d(
      "jbadge",
      "inline-flex items-center gap-1 rounded-full border",
      "px-2.5 py-0.5 text-xs font-semibold transition-colors duration-200",
      l[t],
      e
    ),
    style: r,
    ...o,
    children: a
  }
);
export {
  p as JBadgeView
};
//# sourceMappingURL=JBadgeView.js.map
