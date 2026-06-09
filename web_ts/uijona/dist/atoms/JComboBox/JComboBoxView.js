import { jsxs as j, jsx as a } from "react/jsx-runtime";
import { cn as y } from "../../lib/cn.js";
const w = {
  sm: "h-7 text-xs px-2 py-0.5",
  md: "h-9 text-sm px-3 py-1",
  lg: "h-11 text-base px-4 py-2"
}, z = {
  default: "bg-white border-neutral-300",
  filled: "bg-neutral-50 border-neutral-200"
}, N = ({
  options: i,
  groups: s,
  placeholder: o,
  value: c,
  hasError: t = !1,
  disabled: u = !1,
  size: b = "md",
  variant: n = "default",
  className: m,
  style: v,
  onChange: d,
  onFocus: f,
  onBlur: r,
  forwardedRef: p,
  ...x
}) => {
  const g = (e) => d == null ? void 0 : d(e.target.value, e), h = (e) => r == null ? void 0 : r(e.target.value, e);
  return /* @__PURE__ */ j(
    "select",
    {
      ref: p,
      value: c,
      disabled: u,
      "aria-invalid": t || void 0,
      "data-jcombobox-size": b,
      "data-jcombobox-variant": n,
      "data-jcombobox-error": t ? "true" : void 0,
      className: y(
        "jcombobox",
        "w-full rounded-md border cursor-pointer",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        "disabled:pointer-events-none disabled:opacity-50",
        w[b],
        z[n],
        t ? "border-danger-500 focus-visible:ring-danger-500" : "focus-visible:ring-primary-500",
        m
      ),
      style: v,
      onChange: g,
      onFocus: f,
      onBlur: h,
      ...x,
      children: [
        o && /* @__PURE__ */ a("option", { value: "", children: o }),
        s ? s.map((e) => /* @__PURE__ */ a("optgroup", { label: e.label, children: e.options.map((l) => /* @__PURE__ */ a("option", { value: l.value, disabled: l.disabled, children: l.label }, l.value)) }, e.label)) : i == null ? void 0 : i.map((e) => /* @__PURE__ */ a("option", { value: e.value, disabled: e.disabled, children: e.label }, e.value))
      ]
    }
  );
};
export {
  N as JComboBoxView
};
//# sourceMappingURL=JComboBoxView.js.map
