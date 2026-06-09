import { jsx as i } from "react/jsx-runtime";
import { cn as l } from "../../lib/cn.js";
import { JSPINNER_DEFAULTS as r } from "./InterJSpinner.js";
const p = {
  sm: "w-3.5 h-3.5 border-2",
  md: "w-5   h-5   border-2",
  lg: "w-7   h-7   border-[3px]",
  xl: "w-10  h-10  border-4"
}, d = {
  current: "border-current border-t-transparent",
  primary: "border-primary-600 border-t-transparent",
  white: "border-white border-t-transparent",
  neutral: "border-neutral-400 border-t-transparent"
}, b = ({
  size: e = r.size,
  color: n = r.color,
  label: a = r.label,
  className: t,
  style: o,
  forwardedRef: s
}) => /* @__PURE__ */ i(
  "span",
  {
    ref: s,
    role: "status",
    "aria-label": a,
    "data-jspinner-size": e,
    "data-jspinner-color": n,
    style: o,
    className: l(
      "jspinner",
      "inline-block rounded-full animate-spin",
      p[e],
      d[n],
      t
    )
  }
);
b.displayName = "JSpinnerView";
export {
  b as JSpinnerView
};
//# sourceMappingURL=JSpinnerView.js.map
