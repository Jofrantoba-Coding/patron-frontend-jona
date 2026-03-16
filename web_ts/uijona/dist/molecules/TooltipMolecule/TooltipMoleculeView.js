import { jsxs as p, Fragment as x, jsx as e } from "react/jsx-runtime";
import { createPortal as d } from "react-dom";
import { cn as f } from "../../lib/cn.js";
const b = ({
  content: o,
  className: t,
  children: n,
  visible: r,
  style: l,
  triggerRef: s,
  onMouseEnter: i,
  onMouseLeave: m,
  onFocus: a,
  onBlur: c
}) => /* @__PURE__ */ p(x, { children: [
  /* @__PURE__ */ e("span", { ref: s, className: "inline-flex", onMouseEnter: i, onMouseLeave: m, onFocus: a, onBlur: c, children: n }),
  r && d(
    /* @__PURE__ */ e("div", { role: "tooltip", style: l, className: f("max-w-xs rounded bg-neutral-900 px-2.5 py-1.5 text-xs text-white shadow-md pointer-events-none select-none", t), children: o }),
    document.body
  )
] });
export {
  b as TooltipMoleculeView
};
//# sourceMappingURL=TooltipMoleculeView.js.map
