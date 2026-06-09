import { jsx as m, jsxs as C } from "react/jsx-runtime";
import { useRef as I, useState as J, useEffect as S } from "react";
import { cn as a } from "../../lib/cn.js";
const V = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5"
}, q = {
  right: "flex flex-row items-center gap-2",
  left: "flex flex-row-reverse items-center gap-2",
  top: "flex flex-col-reverse items-start gap-1",
  bottom: "flex flex-col items-start gap-1"
}, F = ({
  checked: i,
  defaultChecked: h,
  indeterminate: r = !1,
  hasError: l = !1,
  disabled: c = !1,
  size: f = "md",
  label: u,
  labelPosition: g = "right",
  labelClassName: d,
  className: k,
  style: j,
  onCheckedChange: n,
  onFocus: v,
  onBlur: b,
  forwardedRef: s,
  ...w
}) => {
  const o = I(null), p = i !== void 0, [y, N] = J(h ?? !1), t = p ? i : y;
  S(() => {
    o.current && (o.current.indeterminate = r && !t);
  }, [r, t]);
  const z = (e) => {
    o.current = e, e && (e.indeterminate = r && !t), s && (typeof s == "function" ? s(e) : s.current = e);
  }, B = (e) => {
    c || (p || N(e.target.checked), n == null || n(e.target.checked, e));
  }, x = /* @__PURE__ */ m(
    "input",
    {
      ref: z,
      type: "checkbox",
      checked: t,
      disabled: c,
      "data-jcheckbox-size": f,
      "data-jcheckbox-error": l ? "true" : void 0,
      "data-jcheckbox-indeterminate": r && !t ? "true" : void 0,
      className: a(
        "jcheckbox",
        V[f],
        l ? "border-danger-500 accent-danger-500" : "border-neutral-300 accent-primary-600",
        k
      ),
      style: j,
      onChange: B,
      onFocus: v,
      onBlur: b,
      ...w
    }
  );
  return u ? /* @__PURE__ */ C("label", { className: a(
    "inline-flex",
    q[g],
    c ? "cursor-not-allowed" : "cursor-pointer"
  ), children: [
    x,
    /* @__PURE__ */ m("span", { className: a(
      "text-sm text-neutral-700 select-none leading-none",
      c && "opacity-50",
      d
    ), children: u })
  ] }) : x;
};
export {
  F as JCheckBoxView
};
//# sourceMappingURL=JCheckBoxView.js.map
