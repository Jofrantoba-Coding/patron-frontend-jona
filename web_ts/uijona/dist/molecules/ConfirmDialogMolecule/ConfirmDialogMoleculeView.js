import { jsxs as a, jsx as e } from "react/jsx-runtime";
import { createPortal as u } from "react-dom";
import { cn as f } from "../../lib/cn.js";
import { PanelAtomImpl as n } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { ButtonAtomImpl as l } from "../../atoms/ButtonAtom/ButtonAtomImpl.js";
const g = {
  danger: /* @__PURE__ */ e("svg", { className: "h-6 w-6 text-danger-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ e("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" }) }),
  warning: /* @__PURE__ */ e("svg", { className: "h-6 w-6 text-yellow-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ e("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" }) }),
  info: /* @__PURE__ */ e("svg", { className: "h-6 w-6 text-primary-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ e("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" }) })
}, p = {
  danger: "destructive",
  warning: "default",
  info: "default"
}, N = ({
  open: d,
  title: s,
  description: i,
  variant: r,
  confirmLabel: c,
  cancelLabel: m,
  isLoading: o,
  onConfirm: h,
  onCancel: t
}) => d ? u(
  /* @__PURE__ */ a(n, { variant: "ghost", padding: "none", radius: "none", className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
    /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: "absolute inset-0 bg-black/50", "aria-hidden": "true", onClick: t }),
    /* @__PURE__ */ a(
      n,
      {
        variant: "ghost",
        padding: "none",
        radius: "none",
        role: "alertdialog",
        "aria-modal": "true",
        "aria-labelledby": "confirm-title",
        "aria-describedby": i ? "confirm-desc" : void 0,
        className: "relative z-10 flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-5 shadow-xl sm:max-w-md",
        children: [
          /* @__PURE__ */ a(n, { variant: "ghost", padding: "none", radius: "none", className: "flex items-start gap-3", children: [
            /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: f(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              r === "danger" && "bg-danger-50",
              r === "warning" && "bg-yellow-50",
              r === "info" && "bg-primary-50"
            ), children: g[r] }),
            /* @__PURE__ */ a(n, { variant: "ghost", padding: "none", radius: "none", className: "flex min-w-0 flex-col gap-1", children: [
              /* @__PURE__ */ e("h2", { id: "confirm-title", className: "break-words text-base font-semibold text-neutral-900", children: s }),
              i && /* @__PURE__ */ e("p", { id: "confirm-desc", className: "break-words text-sm text-neutral-500", children: i })
            ] })
          ] }),
          /* @__PURE__ */ a(n, { variant: "ghost", padding: "none", radius: "none", className: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", children: [
            /* @__PURE__ */ e(l, { variant: "outline", onClick: t, disabled: o, children: m }),
            /* @__PURE__ */ e(l, { variant: p[r], onClick: h, loading: o, children: c })
          ] })
        ]
      }
    )
  ] }),
  document.body
) : null;
export {
  N as ConfirmDialogMoleculeView
};
//# sourceMappingURL=ConfirmDialogMoleculeView.js.map
