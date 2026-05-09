import { jsxs as l, jsx as e } from "react/jsx-runtime";
import { createPortal as u } from "react-dom";
import { cn as g } from "../../lib/cn.js";
import { ButtonAtomImpl as h } from "../../atoms/ButtonAtom/ButtonAtomImpl.js";
const y = ({
  open: s,
  title: a,
  description: i,
  showCloseButton: t = !0,
  className: n,
  children: r,
  footer: o,
  overlayRef: d,
  dialogRef: c,
  onOverlayClick: m,
  onCloseClick: x
}) => s ? u(
  /* @__PURE__ */ l("div", { ref: d, role: "presentation", className: "fixed inset-0 z-50 flex items-center justify-center", children: [
    /* @__PURE__ */ e("div", { className: "absolute inset-0 bg-black/50", "aria-hidden": "true", onClick: m }),
    /* @__PURE__ */ l(
      "div",
      {
        ref: c,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": a ? "dialog-title" : void 0,
        "aria-describedby": i ? "dialog-desc" : void 0,
        tabIndex: -1,
        onClick: (f) => f.stopPropagation(),
        className: g("relative z-10 w-full max-w-md bg-white rounded-lg shadow-xl p-6 flex flex-col gap-4 focus:outline-none", n),
        children: [
          (a || t) && /* @__PURE__ */ l("div", { className: "flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ l("div", { className: "flex flex-col gap-1", children: [
              a && /* @__PURE__ */ e("h2", { id: "dialog-title", className: "text-lg font-semibold text-neutral-900 leading-none", children: a }),
              i && /* @__PURE__ */ e("p", { id: "dialog-desc", className: "text-sm text-neutral-500", children: i })
            ] }),
            t && /* @__PURE__ */ e(h, { variant: "ghost", size: "icon", onClick: x, "aria-label": "Close dialog", className: "shrink-0 -mt-1 -mr-1", children: /* @__PURE__ */ l("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
              /* @__PURE__ */ e("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
              /* @__PURE__ */ e("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
            ] }) })
          ] }),
          r && /* @__PURE__ */ e("div", { className: "text-sm text-neutral-700", children: r }),
          o && /* @__PURE__ */ e("div", { className: "flex justify-end gap-2 pt-2", children: o })
        ]
      }
    )
  ] }),
  document.body
) : null;
export {
  y as DialogMoleculeView
};
//# sourceMappingURL=DialogMoleculeView.js.map
