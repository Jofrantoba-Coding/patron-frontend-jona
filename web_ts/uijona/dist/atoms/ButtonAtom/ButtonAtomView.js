import { jsxs as c, jsx as f } from "react/jsx-runtime";
import { cn as d } from "../../lib/cn.js";
import { SpinnerAtomImpl as g } from "../SpinnerAtom/SpinnerAtomImpl.js";
const x = {
  default: "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500",
  outline: "border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-400",
  ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-400",
  destructive: "bg-danger-500 text-white hover:bg-danger-600 focus-visible:ring-danger-500",
  secondary: "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 focus-visible:ring-neutral-400",
  link: "bg-transparent text-primary-600 underline-offset-4 hover:underline p-0 h-auto focus-visible:ring-primary-500"
}, v = {
  default: "min-h-9 px-4 py-2 text-sm",
  sm: "min-h-7 px-3 py-1 text-xs",
  lg: "min-h-11 px-6 py-2 text-base",
  icon: "h-9 w-9 p-0"
}, j = ({
  variant: r = "default",
  size: e = "default",
  loading: t,
  fullWidth: n,
  disabled: i,
  className: s,
  children: o,
  onClick: a,
  onFocus: l,
  onBlur: u,
  onKeyDown: m,
  forwardedRef: b,
  ...p
}) => /* @__PURE__ */ c(
  "button",
  {
    ref: b,
    disabled: i || t,
    onClick: a,
    onFocus: l,
    onBlur: u,
    onKeyDown: m,
    className: d(
      "inline-flex max-w-full min-w-0 items-center justify-center gap-2 rounded-md text-center font-medium",
      "transition-colors duration-200 cursor-pointer",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      e !== "icon" && "whitespace-normal",
      x[r],
      v[e],
      n && "w-full",
      s
    ),
    ...p,
    children: [
      t && /* @__PURE__ */ f(g, { size: "sm" }),
      o
    ]
  }
);
export {
  j as ButtonAtomView
};
//# sourceMappingURL=ButtonAtomView.js.map
