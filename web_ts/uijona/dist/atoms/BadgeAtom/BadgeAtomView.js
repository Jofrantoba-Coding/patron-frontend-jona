import { jsx as a } from "react/jsx-runtime";
import { cn as o } from "../../lib/cn.js";
const s = {
  default: "bg-primary-600 text-white border-transparent",
  secondary: "bg-neutral-200 text-neutral-700 border-transparent",
  destructive: "bg-danger-500 text-white border-transparent",
  outline: "bg-transparent text-neutral-700 border-neutral-300",
  ghost: "bg-neutral-100 text-neutral-600 border-transparent"
}, i = ({ variant: t = "default", className: e, children: r, ...n }) => /* @__PURE__ */ a(
  "span",
  {
    className: o(
      "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors duration-200",
      s[t],
      e
    ),
    ...n,
    children: r
  }
);
export {
  i as BadgeAtomView
};
//# sourceMappingURL=BadgeAtomView.js.map
