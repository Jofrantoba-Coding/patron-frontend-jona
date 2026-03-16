import { jsx as o } from "react/jsx-runtime";
import { cn as a } from "../../lib/cn.js";
const m = {
  sm: "w-8 h-4",
  md: "w-11 h-6",
  lg: "w-14 h-7"
}, d = {
  sm: "w-3 h-3",
  md: "w-5 h-5",
  lg: "w-6 h-6"
}, i = {
  sm: { on: "translate-x-4", off: "translate-x-0.5" },
  md: { on: "translate-x-5", off: "translate-x-0.5" },
  lg: { on: "translate-x-7", off: "translate-x-0.5" }
}, g = ({
  checked: n,
  hasError: e,
  disabled: r,
  size: t = "md",
  className: l,
  onClick: s,
  id: b,
  "aria-labelledby": f
}) => /* @__PURE__ */ o(
  "button",
  {
    id: b,
    type: "button",
    role: "switch",
    "aria-checked": n,
    "aria-labelledby": f,
    disabled: r,
    onClick: s,
    className: a(
      "relative inline-flex items-center rounded-full transition-colors duration-200 cursor-pointer",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500",
      "disabled:pointer-events-none disabled:opacity-50",
      m[t],
      n ? e ? "bg-danger-500" : "bg-primary-600" : e ? "bg-danger-200" : "bg-neutral-300",
      l
    ),
    children: /* @__PURE__ */ o(
      "span",
      {
        className: a(
          "inline-block rounded-full bg-white shadow transition-transform duration-200",
          d[t],
          n ? i[t].on : i[t].off
        )
      }
    )
  }
);
export {
  g as SwitchAtomView
};
//# sourceMappingURL=SwitchAtomView.js.map
