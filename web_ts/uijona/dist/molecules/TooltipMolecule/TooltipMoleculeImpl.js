import { jsx as h } from "react/jsx-runtime";
import { useState as a, useRef as f } from "react";
import { TOOLTIP_MOLECULE_DEFAULTS as d } from "./InterTooltipMolecule.js";
import { TooltipMoleculeView as g } from "./TooltipMoleculeView.js";
function T(r, s) {
  if (!r.current) return {};
  const t = r.current.getBoundingClientRect(), e = 6, o = { position: "fixed", zIndex: 9999 };
  switch (s) {
    case "top":
      return { ...o, bottom: window.innerHeight - t.top + e, left: t.left + t.width / 2, transform: "translateX(-50%)" };
    case "bottom":
      return { ...o, top: t.bottom + e, left: t.left + t.width / 2, transform: "translateX(-50%)" };
    case "left":
      return { ...o, top: t.top + t.height / 2, right: window.innerWidth - t.left + e, transform: "translateY(-50%)" };
    case "right":
      return { ...o, top: t.top + t.height / 2, left: t.right + e, transform: "translateY(-50%)" };
  }
}
const M = ({
  onShow: r,
  onHide: s,
  ...t
}) => {
  const e = { ...d, ...t }, [o, l] = a(!1), [m, p] = a({}), i = f(null), n = f(null), c = () => {
    n.current = setTimeout(() => {
      p(T(i, e.side)), l(!0), r == null || r();
    }, e.delayMs);
  }, u = () => {
    n.current && clearTimeout(n.current), l(!1), s == null || s();
  };
  return /* @__PURE__ */ h(
    g,
    {
      ...e,
      visible: o,
      style: m,
      triggerRef: i,
      onMouseEnter: c,
      onMouseLeave: u,
      onFocus: c,
      onBlur: u
    }
  );
};
M.displayName = "TooltipMolecule";
export {
  M as TooltipMoleculeImpl
};
//# sourceMappingURL=TooltipMoleculeImpl.js.map
