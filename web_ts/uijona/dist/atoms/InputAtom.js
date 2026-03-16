import { jsx as o } from "react/jsx-runtime";
import p from "react";
import { cn as m } from "../lib/cn.js";
const n = p.forwardRef(
  ({ hasError: d = !1, className: u, onChange: a, onBlur: i, onFocus: c, onKeyDown: e, onEnterPress: l, onClear: r, ...s }, f) => /* @__PURE__ */ o(
    "input",
    {
      ref: f,
      "aria-invalid": d || void 0,
      onChange: (t) => a == null ? void 0 : a(t.target.value, t),
      onBlur: (t) => i == null ? void 0 : i(t.target.value, t),
      onFocus: c,
      onKeyDown: (t) => {
        t.key === "Enter" && (l == null || l(t.target.value, t)), t.key === "Backspace" && t.target.value === "" && (r == null || r()), e == null || e(t);
      },
      className: m(
        "flex h-9 w-full rounded-md border bg-neutral-50 px-3 py-1 text-sm text-neutral-900",
        "placeholder:text-neutral-400 transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        d ? "border-danger-500 focus-visible:ring-danger-500" : "border-neutral-300 focus-visible:ring-primary-500",
        u
      ),
      ...s
    }
  )
);
n.displayName = "InputAtom";
export {
  n as InputAtom
};
//# sourceMappingURL=InputAtom.js.map
