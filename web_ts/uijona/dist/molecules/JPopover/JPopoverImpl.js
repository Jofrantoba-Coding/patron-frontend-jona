import { jsx as h } from "react/jsx-runtime";
import { useState as g, useRef as v, useEffect as L } from "react";
import { JPOPOVER_DEFAULTS as y } from "./InterJPopover.js";
import { JPopoverView as P } from "./JPopoverView.js";
const x = (e) => {
  const o = { ...y, ...e }, [c, a] = g(!1), [w, E] = g({}), s = v(null), f = v(null), m = 8, d = () => {
    if (!s.current) return;
    const t = s.current.getBoundingClientRect(), l = window.innerWidth, r = window.innerHeight;
    let n, i;
    o.side === "bottom" ? n = t.bottom + 4 : o.side === "top" ? n = t.top - 4 : n = t.top, o.side === "right" ? i = t.right + 4 : o.side === "left" ? i = t.left - 4 : o.align === "end" ? i = t.right : o.align === "center" ? i = t.left + t.width / 2 : i = t.left, i = Math.min(Math.max(i, m), l - m), E({
      position: "fixed",
      top: o.side === "top" ? void 0 : n,
      bottom: o.side === "top" ? r - n : void 0,
      left: i,
      transform: o.align === "center" ? "translateX(-50%)" : o.align === "end" ? "translateX(-100%)" : void 0,
      zIndex: 50
    });
  };
  return L(() => {
    if (!c) return;
    const t = (r) => {
      var n;
      r.key === "Escape" && (a(!1), (n = e.onClose) == null || n.call(e));
    }, l = (r) => {
      var n, i, u;
      !((n = s.current) != null && n.contains(r.target)) && !((i = f.current) != null && i.contains(r.target)) && (a(!1), (u = e.onClose) == null || u.call(e));
    };
    return document.addEventListener("keydown", t), document.addEventListener("mousedown", l), window.addEventListener("resize", d), window.addEventListener("scroll", d, !0), () => {
      document.removeEventListener("keydown", t), document.removeEventListener("mousedown", l), window.removeEventListener("resize", d), window.removeEventListener("scroll", d, !0);
    };
  }, [c]), /* @__PURE__ */ h(
    P,
    {
      trigger: e.trigger,
      open: c,
      panelStyle: w,
      triggerRef: s,
      panelRef: f,
      className: e.className,
      onTriggerClick: () => {
        d(), a((t) => {
          var r, n;
          const l = !t;
          return l ? (r = e.onOpen) == null || r.call(e) : (n = e.onClose) == null || n.call(e), l;
        });
      },
      children: e.children
    }
  );
};
x.displayName = "JPopover";
export {
  x as JPopoverImpl
};
//# sourceMappingURL=JPopoverImpl.js.map
