import { jsx as y } from "react/jsx-runtime";
import { useId as M, useState as h, useRef as w, useEffect as T } from "react";
import { JTOOLTIP_DEFAULTS as b } from "./InterJTooltip.js";
import { JTooltipView as v } from "./JTooltipView.js";
const l = 6, c = 8;
function E(r, s) {
  if (!r.current) return {};
  const t = r.current.getBoundingClientRect(), e = Math.min(320, window.innerWidth - c * 2), a = Math.min(
    Math.max(t.left + t.width / 2, c + e / 2),
    window.innerWidth - c - e / 2
  ), o = t.top + t.height / 2, n = {
    position: "fixed",
    zIndex: 9999,
    maxWidth: `${e}px`
  };
  switch (s) {
    case "top":
      return { ...n, bottom: window.innerHeight - t.top + l, left: a, transform: "translateX(-50%)" };
    case "bottom":
      return { ...n, top: t.bottom + l, left: a, transform: "translateX(-50%)" };
    case "left": {
      const i = Math.max(window.innerWidth - t.left + l, c);
      return { ...n, top: o, right: i, transform: "translateY(-50%)" };
    }
    case "right": {
      const i = Math.min(t.right + l, window.innerWidth - c - e);
      return { ...n, top: o, left: i, transform: "translateY(-50%)" };
    }
  }
}
const I = ({ onShow: r, onHide: s, ...t }) => {
  const e = { ...b, ...t }, a = M(), [o, n] = h(!1), [i, g] = h({}), f = w(null), m = w(null), d = () => {
    m.current = setTimeout(() => {
      g(E(f, e.side)), n(!0), r == null || r();
    }, e.delayMs);
  }, u = () => {
    m.current && clearTimeout(m.current), n(!1), s == null || s();
  };
  return T(() => {
    if (!o) return;
    const p = (x) => {
      x.key === "Escape" && u();
    };
    return document.addEventListener("keydown", p), () => document.removeEventListener("keydown", p);
  }, [o]), /* @__PURE__ */ y(
    v,
    {
      ...e,
      tooltipId: a,
      visible: o,
      style: i,
      triggerRef: f,
      onMouseEnter: d,
      onMouseLeave: u,
      onFocus: d,
      onBlur: u
    }
  );
};
I.displayName = "JTooltip";
export {
  I as JTooltipImpl
};
//# sourceMappingURL=JTooltipImpl.js.map
