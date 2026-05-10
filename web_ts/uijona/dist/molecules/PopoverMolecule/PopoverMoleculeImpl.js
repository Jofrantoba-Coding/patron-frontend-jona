import { jsx as h } from "react/jsx-runtime";
import { useState as g, useRef as v, useEffect as L } from "react";
import { POPOVER_MOLECULE_DEFAULTS as y } from "./InterPopoverMolecule.js";
import { PopoverMoleculeView as C } from "./PopoverMoleculeView.js";
const P = (e) => {
  const o = { ...y, ...e }, [c, a] = g(!1), [w, E] = g({}), s = v(null), f = v(null), m = 8, d = () => {
    if (!s.current) return;
    const t = s.current.getBoundingClientRect(), r = window.innerWidth, l = window.innerHeight;
    let n, i;
    o.side === "bottom" ? n = t.bottom + 4 : o.side === "top" ? n = t.top - 4 : n = t.top, o.side === "right" ? i = t.right + 4 : o.side === "left" ? i = t.left - 4 : o.align === "end" ? i = t.right : o.align === "center" ? i = t.left + t.width / 2 : i = t.left, i = Math.min(Math.max(i, m), r - m), E({
      position: "fixed",
      top: o.side === "top" ? void 0 : n,
      bottom: o.side === "top" ? l - n : void 0,
      left: i,
      transform: o.align === "center" ? "translateX(-50%)" : o.align === "end" ? "translateX(-100%)" : void 0,
      zIndex: 50
    });
  };
  return L(() => {
    if (!c) return;
    const t = (l) => {
      var n;
      l.key === "Escape" && (a(!1), (n = e.onClose) == null || n.call(e));
    }, r = (l) => {
      var n, i, u;
      !((n = s.current) != null && n.contains(l.target)) && !((i = f.current) != null && i.contains(l.target)) && (a(!1), (u = e.onClose) == null || u.call(e));
    };
    return document.addEventListener("keydown", t), document.addEventListener("mousedown", r), window.addEventListener("resize", d), window.addEventListener("scroll", d, !0), () => {
      document.removeEventListener("keydown", t), document.removeEventListener("mousedown", r), window.removeEventListener("resize", d), window.removeEventListener("scroll", d, !0);
    };
  }, [c]), /* @__PURE__ */ h(
    C,
    {
      trigger: e.trigger,
      open: c,
      panelStyle: w,
      triggerRef: s,
      panelRef: f,
      className: e.className,
      onTriggerClick: () => {
        d(), a((t) => {
          var l, n;
          const r = !t;
          return r ? (l = e.onOpen) == null || l.call(e) : (n = e.onClose) == null || n.call(e), r;
        });
      },
      children: e.children
    }
  );
};
P.displayName = "PopoverMolecule";
export {
  P as PopoverMoleculeImpl
};
//# sourceMappingURL=PopoverMoleculeImpl.js.map
