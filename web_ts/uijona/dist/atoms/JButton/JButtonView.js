import { jsxs as j, jsx as r } from "react/jsx-runtime";
import { cn as w } from "../../lib/cn.js";
import { JSpinnerImpl as I } from "../JSpinner/JSpinnerImpl.js";
const N = {
  default: "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500",
  outline: "border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-400",
  ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-400",
  destructive: "bg-danger-500 text-white hover:bg-danger-600 focus-visible:ring-danger-500",
  secondary: "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 focus-visible:ring-neutral-400",
  link: "bg-transparent text-primary-600 underline-offset-4 hover:underline p-0 h-auto focus-visible:ring-primary-500"
}, z = {
  xs: "min-h-6 px-2 py-0.5 text-xs rounded",
  sm: "min-h-7 px-3 py-1 text-xs rounded-md",
  md: "min-h-9 px-4 py-2 text-sm rounded-md",
  default: "min-h-9 px-4 py-2 text-sm rounded-md",
  lg: "min-h-11 px-6 py-2 text-base rounded-md",
  xl: "min-h-14 px-8 py-3 text-lg rounded-lg",
  icon: "h-9 w-9 p-0 rounded-md"
}, k = ({
  variant: s = "default",
  size: a = "md",
  iconPosition: u = "left",
  loading: e = !1,
  fullWidth: i = !1,
  disabled: l,
  type: d = "button",
  className: m,
  style: p,
  children: t,
  icon: b,
  onClick: c,
  onFocus: f,
  onBlur: x,
  onKeyDown: g,
  forwardedRef: v,
  ...h
}) => {
  const o = e ? /* @__PURE__ */ r(I, { size: "sm" }) : b, n = !!o, y = n && !t;
  return /* @__PURE__ */ j(
    "button",
    {
      ref: v,
      type: d,
      disabled: l || e,
      onClick: c,
      onFocus: f,
      onBlur: x,
      onKeyDown: g,
      "data-jbutton-icon-position": n ? u : void 0,
      "data-jbutton-full-width": i ? "true" : void 0,
      style: p,
      className: w(
        "jbutton",
        "inline-flex items-center justify-center gap-2",
        "font-medium transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        N[s],
        z[a],
        y && "gap-0",
        i && "w-full",
        m
      ),
      ...h,
      children: [
        n && /* @__PURE__ */ r("span", { className: "jbutton-icon", "aria-hidden": e ? void 0 : !0, children: o }),
        t && /* @__PURE__ */ r("span", { className: "jbutton-text", children: t })
      ]
    }
  );
};
export {
  k as JButtonView
};
//# sourceMappingURL=JButtonView.js.map
