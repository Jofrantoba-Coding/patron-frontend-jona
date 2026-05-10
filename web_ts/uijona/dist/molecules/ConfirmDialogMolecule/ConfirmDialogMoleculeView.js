import { jsxs as i, jsx as e } from "react/jsx-runtime";
import { createPortal as h } from "react-dom";
import { cn as f } from "../../lib/cn.js";
import { ButtonAtomImpl as t } from "../../atoms/ButtonAtom/ButtonAtomImpl.js";
const u = {
  danger: /* @__PURE__ */ e("svg", { className: "h-6 w-6 text-danger-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ e("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" }) }),
  warning: /* @__PURE__ */ e("svg", { className: "h-6 w-6 text-yellow-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ e("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" }) }),
  info: /* @__PURE__ */ e("svg", { className: "h-6 w-6 text-primary-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ e("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" }) })
}, x = {
  danger: "destructive",
  warning: "default",
  info: "default"
}, v = ({
  open: o,
  title: d,
  description: l,
  variant: r,
  confirmLabel: s,
  cancelLabel: c,
  isLoading: a,
  onConfirm: m,
  onCancel: n
}) => o ? h(
  /* @__PURE__ */ i("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
    /* @__PURE__ */ e("div", { className: "absolute inset-0 bg-black/50", "aria-hidden": "true", onClick: n }),
    /* @__PURE__ */ i(
      "div",
      {
        role: "alertdialog",
        "aria-modal": "true",
        "aria-labelledby": "confirm-title",
        "aria-describedby": l ? "confirm-desc" : void 0,
        className: "relative z-10 flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-5 shadow-xl sm:max-w-md",
        children: [
          /* @__PURE__ */ i("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ e("div", { className: f(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              r === "danger" && "bg-danger-50",
              r === "warning" && "bg-yellow-50",
              r === "info" && "bg-primary-50"
            ), children: u[r] }),
            /* @__PURE__ */ i("div", { className: "flex min-w-0 flex-col gap-1", children: [
              /* @__PURE__ */ e("h2", { id: "confirm-title", className: "break-words text-base font-semibold text-neutral-900", children: d }),
              l && /* @__PURE__ */ e("p", { id: "confirm-desc", className: "break-words text-sm text-neutral-500", children: l })
            ] })
          ] }),
          /* @__PURE__ */ i("div", { className: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", children: [
            /* @__PURE__ */ e(t, { variant: "outline", onClick: n, disabled: a, children: c }),
            /* @__PURE__ */ e(t, { variant: x[r], onClick: m, loading: a, children: s })
          ] })
        ]
      }
    )
  ] }),
  document.body
) : null;
export {
  v as ConfirmDialogMoleculeView
};
//# sourceMappingURL=ConfirmDialogMoleculeView.js.map
