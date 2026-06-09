import { jsxs as t, jsx as e } from "react/jsx-runtime";
import { createPortal as h } from "react-dom";
import { cn as u } from "../../lib/cn.js";
import { JPanelImpl as n } from "../../atoms/JPanel/JPanelImpl.js";
import { JButtonImpl as l } from "../../atoms/JButton/JButtonImpl.js";
const g = {
  danger: /* @__PURE__ */ e("svg", { className: "h-6 w-6 text-danger-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ e("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" }) }),
  warning: /* @__PURE__ */ e("svg", { className: "h-6 w-6 text-yellow-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ e("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" }) }),
  info: /* @__PURE__ */ e("svg", { className: "h-6 w-6 text-primary-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ e("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" }) })
}, f = {
  danger: "bg-danger-50",
  warning: "bg-yellow-50",
  info: "bg-primary-50"
}, x = {
  danger: "destructive",
  warning: "default",
  info: "default"
}, j = ({
  open: s,
  title: d,
  description: a,
  variant: r,
  confirmLabel: c,
  cancelLabel: m,
  isLoading: i,
  onConfirm: p,
  onCancel: o
}) => s ? h(
  /* @__PURE__ */ t(
    n,
    {
      variant: "ghost",
      padding: "none",
      radius: "none",
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      children: [
        /* @__PURE__ */ e(
          n,
          {
            variant: "ghost",
            padding: "none",
            radius: "none",
            className: "absolute inset-0 bg-black/50",
            "aria-hidden": "true",
            onClick: o
          }
        ),
        /* @__PURE__ */ t(
          n,
          {
            layout: "border",
            variant: "ghost",
            padding: "none",
            radius: "none",
            alignItems: "start",
            role: "alertdialog",
            "aria-modal": "true",
            "aria-labelledby": "joptionpane-title",
            "aria-describedby": a ? "joptionpane-desc" : void 0,
            className: "relative z-10 w-full max-w-sm rounded-lg bg-white shadow-xl sm:max-w-md",
            children: [
              /* @__PURE__ */ e(
                n,
                {
                  area: "left",
                  variant: "ghost",
                  padding: "none",
                  radius: "none",
                  alignItems: "center",
                  tablet: { alignItems: "start" },
                  className: "pt-5 pb-3 sm:pl-5 sm:pr-3 sm:pb-0",
                  children: /* @__PURE__ */ e("div", { className: u("flex h-10 w-10 items-center justify-center rounded-full", f[r]), children: g[r] })
                }
              ),
              /* @__PURE__ */ t(
                "div",
                {
                  "data-panel-area": "center",
                  className: "flex min-w-0 flex-col gap-1 px-5 pb-4 text-center sm:px-0 sm:pt-5 sm:pr-5 sm:text-left",
                  children: [
                    /* @__PURE__ */ e("h2", { id: "joptionpane-title", className: "break-words text-base font-semibold text-neutral-900", children: d }),
                    a && /* @__PURE__ */ e("p", { id: "joptionpane-desc", className: "break-words text-sm text-neutral-500", children: a })
                  ]
                }
              ),
              /* @__PURE__ */ t(
                n,
                {
                  area: "bottom",
                  layout: "flow",
                  variant: "ghost",
                  padding: "none",
                  radius: "none",
                  justifyContent: "center",
                  tablet: { justifyContent: "end" },
                  gap: "sm",
                  className: "px-5 pb-5",
                  children: [
                    /* @__PURE__ */ e(l, { variant: x[r], onClick: p, loading: i, children: c }),
                    /* @__PURE__ */ e(l, { variant: "outline", onClick: o, disabled: i, children: m })
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  ),
  document.body
) : null;
export {
  j as JOptionPaneView
};
//# sourceMappingURL=JOptionPaneView.js.map
