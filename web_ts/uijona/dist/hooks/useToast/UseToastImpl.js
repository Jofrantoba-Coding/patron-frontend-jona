import { jsxs as v, jsx as r } from "react/jsx-runtime";
import { useState as x, useCallback as c, useContext as p, createContext as w } from "react";
import { ToastAtomImpl as T } from "../../atoms/ToastAtom/ToastAtomImpl.js";
const u = w(null), N = ({ children: s }) => {
  const [o, t] = x([]), i = c((e) => {
    t((a) => a.filter((n) => n.id !== e));
  }, []), l = c(({ title: e, message: a, variant: n = "default", duration: m = 4e3 }) => {
    const d = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    t((f) => [...f, { id: d, title: e, message: a, variant: n, duration: m }]);
  }, []);
  return /* @__PURE__ */ v(u.Provider, { value: { toast: l, dismiss: i }, children: [
    s,
    /* @__PURE__ */ r(
      "div",
      {
        "aria-label": "Notifications",
        className: "fixed inset-x-4 bottom-4 z-[100] flex flex-col gap-2 pointer-events-none sm:inset-x-auto sm:right-4 sm:w-auto",
        children: o.map((e) => /* @__PURE__ */ r("div", { className: "pointer-events-auto w-full sm:w-auto", children: /* @__PURE__ */ r(T, { ...e, onDismiss: i }) }, e.id))
      }
    )
  ] });
};
function g() {
  const s = p(u);
  if (!s) throw new Error("useToast must be used inside <ToastProvider>");
  return s;
}
function P() {
  const { toast: s } = g();
  return {
    success: (o, t) => s({ message: o, title: t, variant: "success" }),
    error: (o, t) => s({ message: o, title: t, variant: "danger" }),
    warning: (o, t) => s({ message: o, title: t, variant: "warning" }),
    info: (o, t) => s({ message: o, title: t, variant: "default" })
  };
}
export {
  N as ToastProvider,
  g as useToast,
  P as useToastHelpers
};
//# sourceMappingURL=UseToastImpl.js.map
