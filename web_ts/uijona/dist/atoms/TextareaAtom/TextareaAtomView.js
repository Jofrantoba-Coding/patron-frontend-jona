import { jsx as n } from "react/jsx-runtime";
import { cn as d } from "../../lib/cn.js";
const b = ({
  hasError: e,
  autoResize: u,
  className: r,
  onChange: i,
  onFocus: o,
  onBlur: t,
  onKeyDown: s,
  forwardedRef: a,
  ...l
}) => /* @__PURE__ */ n(
  "textarea",
  {
    ref: a,
    onChange: i,
    onFocus: o,
    onBlur: t,
    onKeyDown: s,
    className: d(
      "flex min-h-[80px] w-full rounded-md border bg-white px-3 py-2 text-sm text-neutral-900",
      "placeholder:text-neutral-400 transition-colors duration-150 resize-y",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary-500",
      "disabled:cursor-not-allowed disabled:opacity-50",
      e ? "border-danger-500 focus-visible:ring-danger-500" : "border-neutral-300",
      r
    ),
    ...l
  }
);
export {
  b as TextareaAtomView
};
//# sourceMappingURL=TextareaAtomView.js.map
