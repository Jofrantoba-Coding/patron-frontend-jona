import { jsx as d } from "react/jsx-runtime";
import { useState as h, useRef as f } from "react";
import { TOOLTIP_MOLECULE_DEFAULTS as p } from "./InterTooltipMolecule.js";
import { TooltipMoleculeView as M } from "./TooltipMoleculeView.js";
function w(r, a) {
  if (!r.current) return {};
  const e = r.current.getBoundingClientRect(), n = 6, t = 8, i = Math.min(320, window.innerWidth - t * 2), l = i / 2, m = Math.min(Math.max(e.left + e.width / 2, t + l), window.innerWidth - t - l), c = Math.min(Math.max(e.top + e.height / 2, t), window.innerHeight - t), o = { position: "fixed", zIndex: 9999, maxWidth: `calc(100vw - ${t * 2}px)` };
  switch (a) {
    case "top":
      return { ...o, bottom: window.innerHeight - e.top + n, left: m, transform: "translateX(-50%)" };
    case "bottom":
      return { ...o, top: e.bottom + n, left: m, transform: "translateX(-50%)" };
    case "left": {
      const s = Math.min(Math.max(window.innerWidth - e.left + n, t), window.innerWidth - t - i);
      return { ...o, top: c, right: s, transform: "translateY(-50%)" };
    }
    case "right": {
      const s = Math.min(Math.max(e.right + n, t), window.innerWidth - t - i);
      return { ...o, top: c, left: s, transform: "translateY(-50%)" };
    }
  }
}
const x = ({
  onShow: r,
  onHide: a,
  ...e
}) => {
  const n = { ...p, ...e }, [t, i] = h(!1), [l, m] = h({}), c = f(null), o = f(null), s = () => {
    o.current = setTimeout(() => {
      m(w(c, n.side)), i(!0), r == null || r();
    }, n.delayMs);
  }, u = () => {
    o.current && clearTimeout(o.current), i(!1), a == null || a();
  };
  return /* @__PURE__ */ d(
    M,
    {
      ...n,
      visible: t,
      style: l,
      triggerRef: c,
      onMouseEnter: s,
      onMouseLeave: u,
      onFocus: s,
      onBlur: u
    }
  );
};
x.displayName = "TooltipMolecule";
export {
  x as TooltipMoleculeImpl
};
//# sourceMappingURL=TooltipMoleculeImpl.js.map
