import { jsxs as d, Fragment as p, jsx as e } from "react/jsx-runtime";
import { createPortal as x } from "react-dom";
import { cn as f } from "../../lib/cn.js";
const b = ({
  content: o,
  className: t,
  children: r,
  visible: n,
  style: s,
  triggerRef: l,
  onMouseEnter: i,
  onMouseLeave: a,
  onFocus: m,
  onBlur: c
}) => /* @__PURE__ */ d(p, { children: [
  /* @__PURE__ */ e("span", { ref: l, className: "inline-flex", onMouseEnter: i, onMouseLeave: a, onFocus: m, onBlur: c, children: r }),
  n && x(
    /* @__PURE__ */ e("div", { role: "tooltip", style: s, className: f("max-w-xs break-words rounded bg-neutral-900 px-2.5 py-1.5 text-xs text-white shadow-md pointer-events-none select-none", t), children: o }),
    document.body
  )
] });
export {
  b as TooltipMoleculeView
};
//# sourceMappingURL=TooltipMoleculeView.js.map
