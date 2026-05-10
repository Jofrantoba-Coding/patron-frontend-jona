import { jsxs as n, Fragment as t, jsx as e } from "react/jsx-runtime";
import { createPortal as s } from "react-dom";
import { cn as p } from "../../lib/cn.js";
const g = ({
  trigger: r,
  children: o,
  open: l,
  panelStyle: m,
  triggerRef: i,
  panelRef: c,
  className: d,
  onTriggerClick: a
}) => /* @__PURE__ */ n(t, { children: [
  /* @__PURE__ */ e("div", { ref: i, className: "inline-block", onClick: a, children: r }),
  l && s(
    /* @__PURE__ */ e(
      "div",
      {
        ref: c,
        role: "dialog",
        style: m,
        className: p(
          "z-50 min-w-[12rem] max-w-[calc(100vw-1rem)] rounded-md border border-neutral-200 bg-white p-3 shadow-lg",
          d
        ),
        children: o
      }
    ),
    document.body
  )
] });
export {
  g as PopoverMoleculeView
};
//# sourceMappingURL=PopoverMoleculeView.js.map
