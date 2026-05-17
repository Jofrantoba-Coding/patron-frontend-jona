import { jsxs as n, jsx as e } from "react/jsx-runtime";
import { createPortal as f } from "react-dom";
import { cn as h } from "../../lib/cn.js";
import { JPanelImpl as a } from "../../atoms/JPanel/JPanelImpl.js";
import { ButtonAtomImpl as p } from "../../atoms/ButtonAtom/ButtonAtomImpl.js";
const k = ({
  open: s,
  title: i,
  description: o,
  showCloseButton: r = !0,
  className: d,
  children: t,
  footer: l,
  overlayRef: m,
  dialogRef: c,
  onOverlayClick: g,
  onCloseClick: u
}) => s ? f(
  /* @__PURE__ */ n(a, { variant: "ghost", padding: "none", radius: "none", ref: m, role: "presentation", className: "fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center", children: [
    /* @__PURE__ */ e(a, { variant: "ghost", padding: "none", radius: "none", className: "absolute inset-0 bg-black/50", "aria-hidden": "true", onClick: g }),
    /* @__PURE__ */ n(
      a,
      {
        variant: "ghost",
        padding: "none",
        radius: "none",
        ref: c,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": i ? "dialog-title" : void 0,
        "aria-describedby": o ? "dialog-desc" : void 0,
        tabIndex: -1,
        onClick: (x) => x.stopPropagation(),
        className: h("relative z-10 my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-lg bg-white p-4 shadow-xl focus:outline-none sm:p-6", d),
        children: [
          (i || r) && /* @__PURE__ */ n(a, { variant: "ghost", padding: "none", radius: "none", className: "flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ n(a, { variant: "ghost", padding: "none", radius: "none", className: "flex min-w-0 flex-col gap-1", children: [
              i && /* @__PURE__ */ e("h2", { id: "dialog-title", className: "text-lg font-semibold text-neutral-900 leading-tight break-words", children: i }),
              o && /* @__PURE__ */ e("p", { id: "dialog-desc", className: "text-sm text-neutral-500 break-words", children: o })
            ] }),
            r && /* @__PURE__ */ e(p, { variant: "ghost", size: "icon", onClick: u, "aria-label": "Close dialog", className: "shrink-0 -mt-1 -mr-1", children: /* @__PURE__ */ n("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
              /* @__PURE__ */ e("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
              /* @__PURE__ */ e("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
            ] }) })
          ] }),
          t && /* @__PURE__ */ e(a, { variant: "ghost", padding: "none", radius: "none", className: "min-w-0 text-sm text-neutral-700", children: t }),
          l && /* @__PURE__ */ e(a, { variant: "ghost", padding: "none", radius: "none", className: "flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end", children: l })
        ]
      }
    )
  ] }),
  document.body
) : null;
export {
  k as DialogMoleculeView
};
//# sourceMappingURL=DialogMoleculeView.js.map
