import { jsx as a } from "react/jsx-runtime";
import { cn as d } from "../../lib/cn.js";
const p = ({
  checked: e,
  hasError: r,
  disabled: o,
  className: i,
  onFocus: n,
  onBlur: t,
  forwardedRef: s,
  ...c
}) => /* @__PURE__ */ a(
  "input",
  {
    ref: s,
    type: "checkbox",
    checked: e,
    disabled: o,
    onFocus: n,
    onBlur: t,
    className: d(
      "h-4 w-4 rounded border cursor-pointer",
      "transition-colors duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary-500",
      "disabled:pointer-events-none disabled:opacity-50",
      r ? "border-danger-500 text-danger-500" : "border-neutral-300 text-primary-600",
      i
    ),
    ...c
  }
);
export {
  p as CheckboxAtomView
};
//# sourceMappingURL=CheckboxAtomView.js.map
