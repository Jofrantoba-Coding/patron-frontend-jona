import { jsxs as d, Fragment as c, jsx as e } from "react/jsx-runtime";
import { createPortal as x } from "react-dom";
import { cn as f } from "../../lib/cn.js";
import { JPanelImpl as h } from "../../atoms/JPanel/JPanelImpl.js";
const j = ({
  content: o,
  className: n,
  children: t,
  visible: r,
  style: a,
  triggerRef: s,
  onMouseEnter: i,
  onMouseLeave: l,
  onFocus: m,
  onBlur: p
}) => /* @__PURE__ */ d(c, { children: [
  /* @__PURE__ */ e("span", { ref: s, className: "inline-flex", onMouseEnter: i, onMouseLeave: l, onFocus: m, onBlur: p, children: t }),
  r && x(
    /* @__PURE__ */ e(h, { variant: "ghost", padding: "none", radius: "none", role: "tooltip", style: a, className: f("max-w-xs break-words rounded bg-neutral-900 px-2.5 py-1.5 text-xs text-white shadow-md pointer-events-none select-none", n), children: o }),
    document.body
  )
] });
export {
  j as TooltipMoleculeView
};
//# sourceMappingURL=TooltipMoleculeView.js.map
