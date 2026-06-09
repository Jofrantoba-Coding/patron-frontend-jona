import { jsxs as s, Fragment as c, jsx as r } from "react/jsx-runtime";
import { createPortal as p } from "react-dom";
import { cn as g } from "../../lib/cn.js";
import { JPanelImpl as o } from "../../atoms/JPanel/JPanelImpl.js";
const u = ({
  trigger: e,
  children: n,
  open: a,
  panelStyle: i,
  triggerRef: m,
  panelRef: d,
  className: t,
  onTriggerClick: l
}) => /* @__PURE__ */ s(c, { children: [
  /* @__PURE__ */ r(o, { variant: "ghost", padding: "none", radius: "none", ref: m, className: "inline-block", onClick: l, children: e }),
  a && p(
    /* @__PURE__ */ r(
      o,
      {
        variant: "ghost",
        padding: "none",
        radius: "none",
        ref: d,
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
  u as JPopoverView
};
//# sourceMappingURL=JPopoverView.js.map
