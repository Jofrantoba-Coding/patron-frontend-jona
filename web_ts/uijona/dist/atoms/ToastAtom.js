import { jsxs as i, jsx as e } from "react/jsx-runtime";
import { cn as l } from "../lib/cn.js";
const o = {
  default: "bg-white border-neutral-200 text-neutral-900",
  success: "bg-success-500 border-success-600 text-white",
  destructive: "bg-danger-500 border-danger-600 text-white",
  warning: "bg-yellow-400 border-yellow-500 text-yellow-900"
}, c = {
  default: "ℹ",
  success: "✓",
  destructive: "✕",
  warning: "⚠"
}, h = ({ id: r, title: t, description: s, variant: a = "default", onDismiss: n }) => /* @__PURE__ */ i("div", { role: "status", "aria-live": "polite", className: l("flex items-start gap-3 w-80 rounded-md border shadow-lg px-4 py-3", o[a]), children: [
  /* @__PURE__ */ e("span", { className: "text-base leading-none mt-0.5 shrink-0", "aria-hidden": "true", children: c[a] }),
  /* @__PURE__ */ i("div", { className: "flex-1 min-w-0", children: [
    t && /* @__PURE__ */ e("p", { className: "text-sm font-semibold leading-tight", children: t }),
    s && /* @__PURE__ */ e("p", { className: "text-xs mt-0.5 opacity-90", children: s })
  ] }),
  /* @__PURE__ */ e("button", { onClick: () => n(r), "aria-label": "Dismiss notification", className: "shrink-0 opacity-70 hover:opacity-100 transition-opacity text-sm leading-none", children: "✕" })
] });
export {
  h as ToastAtom
};
//# sourceMappingURL=ToastAtom.js.map
