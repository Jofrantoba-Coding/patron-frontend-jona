import { jsxs as p, Fragment as x, jsx as r } from "react/jsx-runtime";
import { createPortal as f } from "react-dom";
import { cn as b } from "../../lib/cn.js";
const y = ({
  tooltipId: e,
  content: t,
  className: n,
  children: i,
  visible: o,
  style: s,
  triggerRef: a,
  onMouseEnter: d,
  onMouseLeave: m,
  onFocus: c,
  onBlur: l
}) => /* @__PURE__ */ p(x, { children: [
  /* @__PURE__ */ r(
    "span",
    {
      ref: a,
      className: "inline-flex",
      "aria-describedby": o ? e : void 0,
      onMouseEnter: d,
      onMouseLeave: m,
      onFocus: c,
      onBlur: l,
      children: i
    }
  ),
  o && f(
    /* @__PURE__ */ r(
      "div",
      {
        id: e,
        role: "tooltip",
        style: s,
        className: b(
          "pointer-events-none select-none break-words rounded bg-neutral-900",
          "px-2.5 py-1.5 text-xs text-white shadow-md",
          n
        ),
        children: t
      }
    ),
    document.body
  )
] });
export {
  y as JTooltipView
};
//# sourceMappingURL=JTooltipView.js.map
