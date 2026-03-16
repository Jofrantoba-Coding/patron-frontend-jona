import { jsxs as g, jsx as p } from "react/jsx-runtime";
import { cn as c } from "../../lib/cn.js";
import { SpinnerAtomImpl as m } from "../SpinnerAtom/SpinnerAtomImpl.js";
const v = {
  default: "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500",
  outline: "border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-400",
  ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-400",
  destructive: "bg-danger-500 text-white hover:bg-danger-600 focus-visible:ring-danger-500",
  secondary: "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 focus-visible:ring-neutral-400",
  link: "bg-transparent text-primary-600 underline-offset-4 hover:underline p-0 h-auto focus-visible:ring-primary-500"
}, x = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-7 px-3 text-xs",
  lg: "h-11 px-6 text-base",
  icon: "h-9 w-9 p-0"
}, j = ({
  variant: t = "default",
  size: r = "default",
  loading: e,
  fullWidth: i,
  disabled: n,
  className: s,
  children: o,
  onClick: a,
  onFocus: l,
  onBlur: u,
  onKeyDown: b,
  forwardedRef: f,
  ...d
}) => /* @__PURE__ */ g(
  "button",
  {
    ref: f,
    disabled: n || e,
    onClick: a,
    onFocus: l,
    onBlur: u,
    onKeyDown: b,
    className: c(
      "inline-flex items-center justify-center gap-2 rounded-md font-medium",
      "transition-colors duration-200 cursor-pointer",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      v[t],
      x[r],
      i && "w-full",
      s
    ),
    ...d,
    children: [
      e && /* @__PURE__ */ p(m, { size: "sm" }),
      o
    ]
  }
);
export {
  j as ButtonAtomView
};
//# sourceMappingURL=ButtonAtomView.js.map
