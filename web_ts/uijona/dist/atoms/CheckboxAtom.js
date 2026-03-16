import { jsx as o } from "react/jsx-runtime";
import { cn as u } from "../lib/cn.js";
const m = ({
  id: l,
  checked: r = !1,
  onCheckedChange: i,
  onFocus: s,
  onBlur: a,
  disabled: t = !1,
  hasError: e = !1,
  className: n,
  "aria-label": b
}) => /* @__PURE__ */ o(
  "button",
  {
    id: l,
    role: "checkbox",
    type: "button",
    "aria-checked": r,
    "aria-invalid": e || void 0,
    "aria-label": b,
    disabled: t,
    onClick: () => !t && (i == null ? void 0 : i(!r)),
    onFocus: s,
    onBlur: a,
    className: u(
      "h-4 w-4 shrink-0 rounded-sm border transition-colors duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      r ? "bg-primary-600 border-primary-600 text-white" : "bg-white border-neutral-300",
      e && "border-danger-500",
      n
    ),
    children: r && /* @__PURE__ */ o("svg", { className: "h-3 w-3 mx-auto text-white", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ o("polyline", { points: "2,6 5,9 10,3" }) })
  }
);
export {
  m as CheckboxAtom
};
//# sourceMappingURL=CheckboxAtom.js.map
