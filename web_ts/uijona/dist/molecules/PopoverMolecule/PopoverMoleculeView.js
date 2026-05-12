import { jsxs as s, Fragment as c, jsx as o } from "react/jsx-runtime";
import { createPortal as p } from "react-dom";
import { cn as g } from "../../lib/cn.js";
import { PanelAtomImpl as e } from "../../atoms/PanelAtom/PanelAtomImpl.js";
const b = ({
  trigger: r,
  children: n,
  open: a,
  panelStyle: i,
  triggerRef: m,
  panelRef: l,
  className: t,
  onTriggerClick: d
}) => /* @__PURE__ */ s(c, { children: [
  /* @__PURE__ */ o(e, { variant: "ghost", padding: "none", radius: "none", ref: m, className: "inline-block", onClick: d, children: r }),
  a && p(
    /* @__PURE__ */ o(
      e,
      {
        variant: "ghost",
        padding: "none",
        radius: "none",
        ref: l,
        role: "dialog",
        style: i,
        className: g(
          "z-50 min-w-[12rem] max-w-[calc(100vw-1rem)] rounded-md border border-neutral-200 bg-white p-3 shadow-lg",
          t
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
