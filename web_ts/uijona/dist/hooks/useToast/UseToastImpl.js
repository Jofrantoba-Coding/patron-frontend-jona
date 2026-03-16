import { jsxs as v, jsx as a } from "react/jsx-runtime";
import { useState as p, useCallback as c, useContext as x, createContext as T } from "react";
import { ToastAtomImpl as g } from "../../atoms/ToastAtom/ToastAtomImpl.js";
const l = T(null), N = ({ children: s }) => {
  const [e, t] = p([]), i = c((o) => {
    t((n) => n.filter((r) => r.id !== o));
  }, []), u = c(({ title: o, message: n, variant: r = "default", duration: d = 4e3 }) => {
    const m = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    t((f) => [...f, { id: m, title: o, message: n, variant: r, duration: d }]);
  }, []);
  return /* @__PURE__ */ v(l.Provider, { value: { toast: u, dismiss: i }, children: [
    s,
    /* @__PURE__ */ a("div", { "aria-label": "Notifications", className: "fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none", children: e.map((o) => /* @__PURE__ */ a("div", { className: "pointer-events-auto", children: /* @__PURE__ */ a(g, { ...o, onDismiss: i }) }, o.id)) })
  ] });
};
function h() {
  const s = x(l);
  if (!s) throw new Error("useToast must be used inside <ToastProvider>");
  return s;
}
function P() {
  const { toast: s } = h();
  return {
    success: (e, t) => s({ message: e, title: t, variant: "success" }),
    error: (e, t) => s({ message: e, title: t, variant: "danger" }),
    warning: (e, t) => s({ message: e, title: t, variant: "warning" }),
    info: (e, t) => s({ message: e, title: t, variant: "default" })
  };
}
export {
  N as ToastProvider,
  h as useToast,
  P as useToastHelpers
};
//# sourceMappingURL=UseToastImpl.js.map
