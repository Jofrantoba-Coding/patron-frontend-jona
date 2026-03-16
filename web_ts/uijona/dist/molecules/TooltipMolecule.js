import { jsxs as R, Fragment as M, jsx as u } from "react/jsx-runtime";
import { useState as f, useRef as m } from "react";
import { createPortal as T } from "react-dom";
import { cn as j } from "../lib/cn.js";
const X = ({ content: p, side: d = "top", delayMs: h = 300, className: g, children: x, onShow: n, onHide: o }) => {
  const [b, l] = f(!1), [w, y] = f({}), s = m(null), i = m(null), e = 6, v = () => {
    if (!s.current) return {};
    const t = s.current.getBoundingClientRect(), r = { position: "fixed", zIndex: 9999 };
    switch (d) {
      case "top":
        return { ...r, bottom: window.innerHeight - t.top + e, left: t.left + t.width / 2, transform: "translateX(-50%)" };
      case "bottom":
        return { ...r, top: t.bottom + e, left: t.left + t.width / 2, transform: "translateX(-50%)" };
      case "left":
        return { ...r, top: t.top + t.height / 2, right: window.innerWidth - t.left + e, transform: "translateY(-50%)" };
      case "right":
        return { ...r, top: t.top + t.height / 2, left: t.right + e, transform: "translateY(-50%)" };
    }
  }, c = () => {
    i.current = setTimeout(() => {
      y(v()), l(!0), n == null || n();
    }, h);
  }, a = () => {
    i.current && clearTimeout(i.current), l(!1), o == null || o();
  };
  return /* @__PURE__ */ R(M, { children: [
    /* @__PURE__ */ u("span", { ref: s, className: "inline-flex", onMouseEnter: c, onMouseLeave: a, onFocus: c, onBlur: a, children: x }),
    b && T(
      /* @__PURE__ */ u("div", { role: "tooltip", style: w, className: j("max-w-xs rounded bg-neutral-900 px-2.5 py-1.5 text-xs text-white shadow-md pointer-events-none select-none", g), children: p }),
      document.body
    )
  ] });
};
export {
  X as TooltipMolecule
};
//# sourceMappingURL=TooltipMolecule.js.map
