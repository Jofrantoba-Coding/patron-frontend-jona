import { jsxs as u, jsx as a } from "react/jsx-runtime";
import v from "react";
import { cn as f } from "../lib/cn.js";
const x = v.forwardRef(
  ({ options: i, groups: r, placeholder: s, hasError: b = !1, className: c, onChange: d, onBlur: t, onFocus: n, ...o }, m) => /* @__PURE__ */ u(
    "select",
    {
      ref: m,
      "aria-invalid": b || void 0,
      onChange: (e) => d == null ? void 0 : d(e.target.value, e),
      onBlur: (e) => t == null ? void 0 : t(e.target.value, e),
      onFocus: n,
      className: f(
        "flex h-9 w-full rounded-md border bg-neutral-50 px-3 py-1 text-sm text-neutral-900",
        "transition-colors duration-200 cursor-pointer appearance-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        b ? "border-danger-500 focus-visible:ring-danger-500" : "border-neutral-300 focus-visible:ring-primary-500",
        c
      ),
      ...o,
      children: [
        s && /* @__PURE__ */ a("option", { value: "", disabled: !0, children: s }),
        i == null ? void 0 : i.map((e) => /* @__PURE__ */ a("option", { value: e.value, disabled: e.disabled, children: e.label }, e.value)),
        r == null ? void 0 : r.map((e) => /* @__PURE__ */ a("optgroup", { label: e.label, children: e.options.map((l) => /* @__PURE__ */ a("option", { value: l.value, disabled: l.disabled, children: l.label }, l.value)) }, e.label))
      ]
    }
  )
);
x.displayName = "SelectAtom";
export {
  x as SelectAtom
};
//# sourceMappingURL=SelectAtom.js.map
