import { jsxs as v, jsx as i } from "react/jsx-runtime";
import { cn as f } from "../../lib/cn.js";
const x = ({
  options: a,
  groups: r,
  placeholder: d,
  hasError: n = !1,
  className: s,
  forwardedRef: o,
  onChange: t,
  onFocus: b,
  onBlur: u,
  ...c
}) => /* @__PURE__ */ v(
  "select",
  {
    ref: o,
    onChange: t,
    onFocus: b,
    onBlur: u,
    "aria-invalid": n || void 0,
    className: f(
      "flex h-9 w-full rounded-md border bg-white px-3 py-1 text-sm",
      "transition-colors duration-150 cursor-pointer",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
      "disabled:pointer-events-none disabled:opacity-50",
      n ? "border-danger-500 focus-visible:ring-danger-500" : "border-neutral-300 focus-visible:ring-primary-500",
      s
    ),
    ...c,
    children: [
      d && /* @__PURE__ */ i("option", { value: "", children: d }),
      r ? r.map((e) => /* @__PURE__ */ i("optgroup", { label: e.label, children: e.options.map((l) => /* @__PURE__ */ i("option", { value: l.value, disabled: l.disabled, children: l.label }, l.value)) }, e.label)) : a == null ? void 0 : a.map((e) => /* @__PURE__ */ i("option", { value: e.value, disabled: e.disabled, children: e.label }, e.value))
    ]
  }
);
export {
  x as SelectAtomView
};
//# sourceMappingURL=SelectAtomView.js.map
