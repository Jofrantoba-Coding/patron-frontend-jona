import { jsxs as x, jsx as a } from "react/jsx-runtime";
import { useState as T, useCallback as c, useContext as v, createContext as g } from "react";
import { cn as h } from "../../lib/cn.js";
import { JToastImpl as b } from "../../molecules/JToast/JToastImpl.js";
import { JTOAST_POSITION_DEFAULT as S } from "../../molecules/JToast/InterJToast.js";
const w = {
  "top-left": "top-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "top-right": "top-4 right-4",
  "center-left": "top-1/2 -translate-y-1/2 left-4",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  "center-right": "top-1/2 -translate-y-1/2 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-4 right-4"
}, f = g(null), A = ({ children: t, position: e = S }) => {
  const [o, i] = T([]), l = c((r) => {
    i((s) => s.filter((n) => n.id !== r));
  }, []), m = c(({ title: r, message: s, variant: n = "default", duration: p = 4e3 }) => {
    const u = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    i((d) => [...d, { id: u, title: r, message: s, variant: n, duration: p }]);
  }, []);
  return /* @__PURE__ */ x(f.Provider, { value: { toast: m, dismiss: l }, children: [
    t,
    /* @__PURE__ */ a(
      "div",
      {
        "aria-label": "Notifications",
        className: h(
          "pointer-events-none fixed z-[100] flex w-80 flex-col gap-2",
          w[e]
        ),
        children: o.map((r) => /* @__PURE__ */ a("div", { className: "pointer-events-auto", children: /* @__PURE__ */ a(b, { ...r, onDismiss: l }) }, r.id))
      }
    )
  ] });
};
function C() {
  const t = v(f);
  if (!t) throw new Error("useToast must be used inside <ToastProvider>");
  return t;
}
function D() {
  const { toast: t } = C();
  return {
    success: (e, o) => t({ message: e, title: o, variant: "success" }),
    error: (e, o) => t({ message: e, title: o, variant: "danger" }),
    warning: (e, o) => t({ message: e, title: o, variant: "warning" }),
    info: (e, o) => t({ message: e, title: o, variant: "default" })
  };
}
export {
  A as ToastProvider,
  C as useToast,
  D as useToastHelpers
};
//# sourceMappingURL=UseToastImpl.js.map
