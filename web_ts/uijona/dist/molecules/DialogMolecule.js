import { jsxs as l, jsx as r } from "react/jsx-runtime";
import { useRef as y, useEffect as f } from "react";
import { createPortal as b } from "react-dom";
import { cn as w } from "../lib/cn.js";
import { ButtonAtom as N } from "../atoms/ButtonAtom.js";
const p = ({
  open: i,
  onClose: e,
  onOpened: d,
  onClosed: a,
  onConfirm: k,
  onCancel: m,
  title: c,
  description: s,
  showCloseButton: u = !0,
  className: h,
  children: n,
  footer: x
}) => {
  const g = y(null), v = y(null);
  return f(() => {
    if (!i) return;
    const t = (o) => {
      o.key === "Escape" && (e == null || e());
    };
    return document.addEventListener("keydown", t), () => document.removeEventListener("keydown", t);
  }, [i, e]), f(() => {
    if (i)
      document.body.style.overflow = "hidden", d == null || d();
    else if (document.body.style.overflow = "", a) {
      const t = requestAnimationFrame(() => a == null ? void 0 : a());
      return () => cancelAnimationFrame(t);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [i, d, a]), f(() => {
    var t;
    i && ((t = v.current) == null || t.focus());
  }, [i]), i ? b(
    /* @__PURE__ */ l("div", { ref: g, role: "presentation", className: "fixed inset-0 z-50 flex items-center justify-center", onClick: (t) => {
      t.target === g.current && (e == null || e());
    }, children: [
      /* @__PURE__ */ r("div", { className: "absolute inset-0 bg-black/50", "aria-hidden": "true" }),
      /* @__PURE__ */ l("div", { ref: v, role: "dialog", "aria-modal": "true", "aria-labelledby": c ? "dialog-title" : void 0, "aria-describedby": s ? "dialog-desc" : void 0, tabIndex: -1, className: w("relative z-10 w-full max-w-md bg-white rounded-lg shadow-xl p-6 flex flex-col gap-4 focus:outline-none", h), children: [
        (c || u) && /* @__PURE__ */ l("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ l("div", { className: "flex flex-col gap-1", children: [
            c && /* @__PURE__ */ r("h2", { id: "dialog-title", className: "text-lg font-semibold text-neutral-900 leading-none", children: c }),
            s && /* @__PURE__ */ r("p", { id: "dialog-desc", className: "text-sm text-neutral-500", children: s })
          ] }),
          u && /* @__PURE__ */ r(N, { variant: "ghost", size: "icon", onClick: () => {
            m == null || m(), e == null || e();
          }, "aria-label": "Close dialog", className: "shrink-0 -mt-1 -mr-1", children: /* @__PURE__ */ l("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
            /* @__PURE__ */ r("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
            /* @__PURE__ */ r("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
          ] }) })
        ] }),
        n && /* @__PURE__ */ r("div", { className: "text-sm text-neutral-700", children: n }),
        x && /* @__PURE__ */ r("div", { className: "flex justify-end gap-2 pt-2", children: x })
      ] })
    ] }),
    document.body
  ) : null;
};
export {
  p as DialogMolecule
};
//# sourceMappingURL=DialogMolecule.js.map
