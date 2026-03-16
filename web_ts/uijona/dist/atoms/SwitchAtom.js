import { jsx as l } from "react/jsx-runtime";
import { cn as s } from "../lib/cn.js";
const w = {
  sm: { track: "h-4 w-7", thumb: "h-3 w-3", translate: "translate-x-3" },
  md: { track: "h-5 w-9", thumb: "h-4 w-4", translate: "translate-x-4" },
  lg: { track: "h-6 w-11", thumb: "h-5 w-5", translate: "translate-x-5" }
}, h = ({
  id: n,
  checked: t = !1,
  onCheckedChange: a,
  onFocus: e,
  onBlur: o,
  disabled: r = !1,
  hasError: i = !1,
  size: b = "md",
  className: u,
  "aria-label": m,
  "aria-labelledby": c
}) => {
  const { track: d, thumb: f, translate: p } = w[b];
  return /* @__PURE__ */ l(
    "button",
    {
      id: n,
      type: "button",
      role: "switch",
      "aria-checked": t,
      "aria-invalid": i || void 0,
      "aria-label": m,
      "aria-labelledby": c,
      disabled: r,
      onClick: () => !r && (a == null ? void 0 : a(!t)),
      onFocus: e,
      onBlur: o,
      className: s(
        "relative inline-flex shrink-0 cursor-pointer items-center rounded-full",
        "border-2 border-transparent transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        t ? i ? "bg-danger-500" : "bg-primary-600" : "bg-neutral-300",
        d,
        u
      ),
      children: /* @__PURE__ */ l("span", { "aria-hidden": "true", className: s("pointer-events-none inline-block rounded-full bg-white shadow-sm transition-transform duration-200", t ? p : "translate-x-0", f) })
    }
  );
};
export {
  h as SwitchAtom
};
//# sourceMappingURL=SwitchAtom.js.map
