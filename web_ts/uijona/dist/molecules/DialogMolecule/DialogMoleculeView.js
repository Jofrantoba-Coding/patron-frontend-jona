import { jsxs as l, jsx as e } from "react/jsx-runtime";
import { createPortal as u } from "react-dom";
import { cn as g } from "../../lib/cn.js";
import { ButtonAtomImpl as h } from "../../atoms/ButtonAtom/ButtonAtomImpl.js";
const y = ({
  open: s,
  title: a,
  description: i,
  showCloseButton: r = !0,
  className: d,
  children: t,
  footer: o,
  overlayRef: n,
  dialogRef: m,
  onOverlayClick: c,
  onCloseClick: x
}) => s ? u(
  /* @__PURE__ */ l("div", { ref: n, role: "presentation", className: "fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center", children: [
    /* @__PURE__ */ e("div", { className: "absolute inset-0 bg-black/50", "aria-hidden": "true", onClick: c }),
    /* @__PURE__ */ l(
      "div",
      {
        ref: m,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": a ? "dialog-title" : void 0,
        "aria-describedby": i ? "dialog-desc" : void 0,
        tabIndex: -1,
        onClick: (f) => f.stopPropagation(),
        className: g("relative z-10 my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-lg bg-white p-4 shadow-xl focus:outline-none sm:p-6", d),
        children: [
          (a || r) && /* @__PURE__ */ l("div", { className: "flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ l("div", { className: "flex min-w-0 flex-col gap-1", children: [
              a && /* @__PURE__ */ e("h2", { id: "dialog-title", className: "text-lg font-semibold text-neutral-900 leading-tight break-words", children: a }),
              i && /* @__PURE__ */ e("p", { id: "dialog-desc", className: "text-sm text-neutral-500 break-words", children: i })
            ] }),
            r && /* @__PURE__ */ e(h, { variant: "ghost", size: "icon", onClick: x, "aria-label": "Close dialog", className: "shrink-0 -mt-1 -mr-1", children: /* @__PURE__ */ l("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
              /* @__PURE__ */ e("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
              /* @__PURE__ */ e("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
            ] }) })
          ] }),
          t && /* @__PURE__ */ e("div", { className: "min-w-0 text-sm text-neutral-700", children: t }),
          o && /* @__PURE__ */ e("div", { className: "flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end", children: o })
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
