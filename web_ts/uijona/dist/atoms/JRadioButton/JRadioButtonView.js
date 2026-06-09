import { jsx as l, jsxs as N } from "react/jsx-runtime";
import { cn as o } from "../../lib/cn.js";
import { JRADIOBUTTON_DEFAULTS as i } from "./InterJRadioButton.js";
const j = {
  right: "flex flex-row items-center gap-2",
  left: "flex flex-row-reverse items-center gap-2",
  top: "flex flex-col-reverse items-start gap-1",
  bottom: "flex flex-col items-start gap-1"
}, B = ({
  checked: c,
  hasError: s = i.hasError,
  disabled: e = i.disabled,
  id: p,
  name: f,
  value: u,
  label: n,
  labelPosition: m = i.labelPosition,
  labelClassName: d,
  className: x,
  style: g,
  onCheckedChange: r,
  onFocus: b,
  onBlur: v,
  forwardedRef: w,
  ...y
}) => {
  const a = /* @__PURE__ */ l(
    "input",
    {
      ref: w,
      type: "radio",
      id: p,
      name: f,
      value: u,
      checked: c,
      disabled: e,
      "data-jradiobutton-error": s || void 0,
      onChange: (t) => {
        e || r == null || r(t.target.checked, t.target.value, t);
      },
      onFocus: b,
      onBlur: v,
      style: g,
      className: o(
        "jradiobutton",
        "h-4 w-4 border cursor-pointer",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary-500",
        "disabled:pointer-events-none disabled:opacity-50",
        s ? "border-danger-500 text-danger-500" : "border-neutral-300 text-primary-600",
        x
      ),
      ...y
    }
  );
  return n ? /* @__PURE__ */ N("label", { className: o(
    "inline-flex",
    j[m],
    e ? "cursor-not-allowed" : "cursor-pointer"
  ), children: [
    a,
    /* @__PURE__ */ l("span", { className: o(
      "text-sm text-neutral-700 select-none leading-none",
      e && "opacity-50",
      d
    ), children: n })
  ] }) : a;
};
B.displayName = "JRadioButtonView";
export {
  B as JRadioButtonView
};
//# sourceMappingURL=JRadioButtonView.js.map
