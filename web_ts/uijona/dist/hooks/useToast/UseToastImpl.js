import { jsxs as v, jsx as r } from "react/jsx-runtime";
import { useState as x, useCallback as u, useContext as g, createContext as h } from "react";
import { PanelAtomImpl as c } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { ToastAtomImpl as w } from "../../atoms/ToastAtom/ToastAtomImpl.js";
const l = h(null), j = ({ children: s }) => {
  const [o, t] = x([]), i = u((e) => {
    t((n) => n.filter((a) => a.id !== e));
  }, []), m = u(({ title: e, message: n, variant: a = "default", duration: d = 4e3 }) => {
    const f = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    t((p) => [...p, { id: f, title: e, message: n, variant: a, duration: d }]);
  }, []);
  return /* @__PURE__ */ v(l.Provider, { value: { toast: m, dismiss: i }, children: [
    s,
    /* @__PURE__ */ r(
      c,
      {
        variant: "ghost",
        padding: "none",
        radius: "none",
        "aria-label": "Notifications",
        className: "fixed inset-x-4 bottom-4 z-[100] flex flex-col gap-2 pointer-events-none sm:inset-x-auto sm:right-4 sm:w-auto",
        children: o.map((e) => /* @__PURE__ */ r(c, { variant: "ghost", padding: "none", radius: "none", className: "pointer-events-auto w-full sm:w-auto", children: /* @__PURE__ */ r(w, { ...e, onDismiss: i }) }, e.id))
      }
    )
  ] });
};
function T() {
  const s = g(l);
  if (!s) throw new Error("useToast must be used inside <ToastProvider>");
  return s;
}
function A() {
  const { toast: s } = T();
  return {
    success: (o, t) => s({ message: o, title: t, variant: "success" }),
    error: (o, t) => s({ message: o, title: t, variant: "danger" }),
    warning: (o, t) => s({ message: o, title: t, variant: "warning" }),
    info: (o, t) => s({ message: o, title: t, variant: "default" })
  };
}
export {
  j as ToastProvider,
  T as useToast,
  A as useToastHelpers
};
//# sourceMappingURL=UseToastImpl.js.map
