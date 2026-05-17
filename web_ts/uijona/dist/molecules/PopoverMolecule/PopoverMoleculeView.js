import { jsxs as s, Fragment as c, jsx as e } from "react/jsx-runtime";
import { createPortal as p } from "react-dom";
import { cn as g } from "../../lib/cn.js";
import { JPanelImpl as o } from "../../atoms/JPanel/JPanelImpl.js";
const b = ({
  trigger: r,
  children: n,
  open: a,
  panelStyle: i,
  triggerRef: l,
  panelRef: m,
  className: d,
  onTriggerClick: t
}) => /* @__PURE__ */ s(c, { children: [
  /* @__PURE__ */ e(o, { variant: "ghost", padding: "none", radius: "none", ref: l, className: "inline-block", onClick: t, children: r }),
  a && p(
    /* @__PURE__ */ e(
      o,
      {
        variant: "ghost",
        padding: "none",
        radius: "none",
        ref: m,
        role: "dialog",
        style: i,
        className: g(
          "z-50 min-w-[12rem] max-w-[calc(100vw-1rem)] rounded-md border border-neutral-200 bg-white p-3 shadow-lg",
          d
        ),
        children: n
      }
    ),
    document.body
  )
] });
export {
  b as PopoverMoleculeView
};
//# sourceMappingURL=PopoverMoleculeView.js.map
