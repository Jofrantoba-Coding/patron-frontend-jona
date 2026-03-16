import { jsx as a } from "react/jsx-runtime";
import { cn as d } from "../../lib/cn.js";
const c = ({
  hasError: e = !1,
  className: i,
  forwardedRef: r,
  onChange: o,
  onBlur: t,
  onFocus: l,
  onKeyDown: n,
  ...s
}) => /* @__PURE__ */ a(
  "input",
  {
    ref: r,
    "aria-invalid": e || void 0,
    onChange: o,
    onBlur: t,
    onFocus: l,
    onKeyDown: n,
    className: d(
      "flex h-9 w-full rounded-md border bg-neutral-50 px-3 py-1 text-sm text-neutral-900",
      "placeholder:text-neutral-400 transition-colors duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
      "disabled:cursor-not-allowed disabled:opacity-50",
      e ? "border-danger-500 focus-visible:ring-danger-500" : "border-neutral-300 focus-visible:ring-primary-500",
      i
    ),
    ...s
  }
);
export {
  c as InputAtomView
};
//# sourceMappingURL=InputAtomView.js.map
