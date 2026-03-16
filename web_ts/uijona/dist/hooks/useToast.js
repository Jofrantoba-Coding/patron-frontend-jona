import { jsxs as v, jsx as c } from "react/jsx-runtime";
import { createContext as x, useState as p, useCallback as u, useContext as T } from "react";
import { ToastAtom as h } from "../atoms/ToastAtom.js";
const d = x(null), N = ({ children: s }) => {
  const [e, t] = p([]), r = u((o) => {
    t((i) => i.filter((n) => n.id !== o));
  }, []), m = u(({ title: o, description: i, variant: n = "default", duration: a = 4e3 }) => {
    const l = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    t((f) => [...f, { id: l, title: o, description: i, variant: n, duration: a }]), a > 0 && setTimeout(() => r(l), a);
  }, [r]);
  return /* @__PURE__ */ v(d.Provider, { value: { toast: m, dismiss: r }, children: [
    s,
    /* @__PURE__ */ c("div", { "aria-label": "Notifications", className: "fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none", children: e.map((o) => /* @__PURE__ */ c("div", { className: "pointer-events-auto", children: /* @__PURE__ */ c(h, { ...o, onDismiss: r }) }, o.id)) })
  ] });
};
function g() {
  const s = T(d);
  if (!s) throw new Error("useToast must be used inside <ToastProvider>");
  return s;
}
function P() {
  const { toast: s } = g();
  return {
    success: (e, t) => s({ title: e, description: t, variant: "success" }),
    error: (e, t) => s({ title: e, description: t, variant: "destructive" }),
    warning: (e, t) => s({ title: e, description: t, variant: "warning" }),
    info: (e, t) => s({ title: e, description: t, variant: "default" })
  };
}
export {
  N as ToastProvider,
  g as useToast,
  P as useToastHelpers
};
//# sourceMappingURL=useToast.js.map
