import { jsx as d } from "react/jsx-runtime";
import { cn as c } from "../../lib/cn.js";
const b = ({
  checked: r,
  hasError: i,
  disabled: o,
  className: e,
  onFocus: t,
  onBlur: n,
  forwardedRef: s,
  ...a
}) => /* @__PURE__ */ d(
  "input",
  {
    ref: s,
    type: "radio",
    checked: r,
    disabled: o,
    onFocus: t,
    onBlur: n,
    className: c(
      "h-4 w-4 border cursor-pointer",
      "transition-colors duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary-500",
      "disabled:pointer-events-none disabled:opacity-50",
      i ? "border-danger-500 text-danger-500" : "border-neutral-300 text-primary-600",
      e
    ),
    ...a
  }
);
export {
  b as RadioAtomView
};
//# sourceMappingURL=RadioAtomView.js.map
