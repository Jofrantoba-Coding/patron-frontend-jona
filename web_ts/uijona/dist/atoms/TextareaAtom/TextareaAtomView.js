import { jsx as d } from "react/jsx-runtime";
import { cn as u } from "../../lib/cn.js";
const c = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize"
}, m = ({
  hasError: e,
  autoResize: b,
  resize: r = "both",
  className: o,
  onChange: i,
  onFocus: t,
  onBlur: s,
  onKeyDown: n,
  forwardedRef: a,
  ...l
}) => /* @__PURE__ */ d(
  "textarea",
  {
    ref: a,
    onChange: i,
    onFocus: t,
    onBlur: s,
    onKeyDown: n,
    className: u(
      "flex min-h-[80px] w-full rounded-md border bg-white px-3 py-2 text-sm text-neutral-900",
      "placeholder:text-neutral-400 transition-colors duration-150",
      c[r],
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary-500",
      "disabled:cursor-not-allowed disabled:opacity-50",
      e ? "border-danger-500 focus-visible:ring-danger-500" : "border-neutral-300",
      o
    ),
    ...l
  }
);
export {
  m as TextareaAtomView
};
//# sourceMappingURL=TextareaAtomView.js.map
