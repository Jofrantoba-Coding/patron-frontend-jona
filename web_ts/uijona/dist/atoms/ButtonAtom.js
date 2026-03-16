import { jsxs as m, jsx as p } from "react/jsx-runtime";
import c from "react";
import { cn as g } from "../lib/cn.js";
import { SpinnerAtom as v } from "./SpinnerAtom.js";
const x = {
  default: "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500",
  outline: "border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-400",
  ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-400",
  destructive: "bg-danger-500 text-white hover:bg-danger-600 focus-visible:ring-danger-500",
  secondary: "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 focus-visible:ring-neutral-400",
  link: "bg-transparent text-primary-600 underline-offset-4 hover:underline p-0 h-auto focus-visible:ring-primary-500"
}, h = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-7 px-3 text-xs",
  lg: "h-11 px-6 text-base",
  icon: "h-9 w-9 p-0"
}, y = c.forwardRef(
  ({ variant: t = "default", size: r = "default", loading: e = !1, fullWidth: i = !1, disabled: n, className: s, children: o, onClick: a, onFocus: l, onBlur: u, onKeyDown: f, ...b }, d) => /* @__PURE__ */ m(
    "button",
    {
      ref: d,
      disabled: n || e,
      onClick: a,
      onFocus: l,
      onBlur: u,
      onKeyDown: f,
      className: g(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium",
        "transition-colors duration-200 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        x[t],
        h[r],
        i && "w-full",
        s
      ),
      ...b,
      children: [
        e && /* @__PURE__ */ p(v, { size: "sm" }),
        o
      ]
    }
  )
);
y.displayName = "ButtonAtom";
export {
  y as ButtonAtom
};
//# sourceMappingURL=ButtonAtom.js.map
