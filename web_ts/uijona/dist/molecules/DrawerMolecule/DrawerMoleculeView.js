import { jsxs as l, Fragment as y, jsx as e } from "react/jsx-runtime";
import { createPortal as v } from "react-dom";
import { cn as o } from "../../lib/cn.js";
import { JPanelImpl as a } from "../../atoms/JPanel/JPanelImpl.js";
import { JButtonImpl as k } from "../../atoms/JButton/JButtonImpl.js";
const m = {
  right: { panel: "inset-y-0 right-0 h-full flex-col", open: "translate-x-0" },
  left: { panel: "inset-y-0 left-0 h-full flex-col", open: "translate-x-0" },
  top: { panel: "inset-x-0 top-0 w-full flex-col", open: "translate-y-0" },
  bottom: { panel: "inset-x-0 bottom-0 w-full flex-col", open: "translate-y-0" }
}, N = {
  right: "translate-x-full",
  left: "-translate-x-full",
  top: "-translate-y-full",
  bottom: "translate-y-full"
}, z = {
  sm: { right: "w-64", left: "w-64", top: "h-48", bottom: "h-48" },
  md: { right: "w-80", left: "w-80", top: "h-64", bottom: "h-64" },
  lg: { right: "w-[28rem]", left: "w-[28rem]", top: "h-80", bottom: "h-80" },
  full: { right: "w-full", left: "w-full", top: "h-full", bottom: "h-full" }
}, P = ({
  open: i,
  side: t,
  size: c,
  showCloseButton: s,
  title: n,
  description: r,
  className: f,
  children: h,
  footer: d,
  onOverlayClick: p,
  onClose: u
}) => {
  const { panel: x } = m[t], g = N[t], b = z[c][t], w = t === "left" || t === "right";
  return v(
    /* @__PURE__ */ l(y, { children: [
      /* @__PURE__ */ e(
        a,
        {
          variant: "ghost",
          padding: "none",
          radius: "none",
          "aria-hidden": "true",
          onClick: p,
          className: o(
            "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
            i ? "opacity-100" : "opacity-0 pointer-events-none"
          )
        }
      ),
      /* @__PURE__ */ l(
        a,
        {
          variant: "ghost",
          padding: "none",
          radius: "none",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": n ? "drawer-title" : void 0,
          "aria-describedby": r ? "drawer-desc" : void 0,
          className: o(
            "fixed z-50 flex bg-white shadow-xl transition-transform duration-300 ease-in-out",
            x,
            b,
            i ? m[t].open : g,
            f
          ),
          children: [
            (n || s) && /* @__PURE__ */ l(a, { variant: "ghost", padding: "none", radius: "none", className: "flex shrink-0 items-start justify-between gap-4 border-b border-neutral-200 p-4 sm:p-5", children: [
              /* @__PURE__ */ l(a, { variant: "ghost", padding: "none", radius: "none", className: "flex min-w-0 flex-col gap-0.5", children: [
                n && /* @__PURE__ */ e("h2", { id: "drawer-title", className: "break-words text-base font-semibold text-neutral-900", children: n }),
                r && /* @__PURE__ */ e("p", { id: "drawer-desc", className: "break-words text-sm text-neutral-500", children: r })
              ] }),
              s && /* @__PURE__ */ e(k, { variant: "ghost", size: "icon", onClick: u, "aria-label": "Cerrar panel", className: "shrink-0", children: /* @__PURE__ */ l("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
                /* @__PURE__ */ e("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                /* @__PURE__ */ e("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
              ] }) })
            ] }),
            /* @__PURE__ */ e(a, { variant: "ghost", padding: "none", radius: "none", className: o("min-h-0 flex-1 overflow-y-auto p-4 sm:p-5", !w && "overflow-x-auto"), children: h }),
            d && /* @__PURE__ */ e(a, { variant: "ghost", padding: "none", radius: "none", className: "flex shrink-0 flex-col-reverse gap-2 border-t border-neutral-200 p-4 sm:flex-row sm:justify-end sm:p-5", children: d })
          ]
        }
      )
    ] }),
    document.body
  );
};
export {
  P as DrawerMoleculeView
};
//# sourceMappingURL=DrawerMoleculeView.js.map
