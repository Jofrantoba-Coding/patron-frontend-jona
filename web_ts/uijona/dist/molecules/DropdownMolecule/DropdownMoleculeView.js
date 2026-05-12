import { jsxs as n, Fragment as g, jsx as r } from "react/jsx-runtime";
import v from "react";
import { createPortal as w } from "react-dom";
import { cn as l } from "../../lib/cn.js";
import { PanelAtomImpl as s } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { SeparatorAtomImpl as y } from "../../atoms/SeparatorAtom/SeparatorAtomImpl.js";
import { ButtonAtomImpl as N } from "../../atoms/ButtonAtom/ButtonAtomImpl.js";
const R = ({
  trigger: i,
  groups: d,
  className: c,
  open: m,
  menuStyle: p,
  triggerRef: u,
  menuRef: h,
  onTriggerClick: f,
  onItemClick: x,
  onDisabledItemClick: a
}) => /* @__PURE__ */ n(g, { children: [
  /* @__PURE__ */ r(s, { variant: "ghost", padding: "none", radius: "none", ref: u, className: "inline-block", onClick: f, children: i }),
  m && w(
    /* @__PURE__ */ r(s, { variant: "ghost", padding: "none", radius: "none", ref: h, role: "menu", style: p, className: l("max-w-[calc(100vw-1rem)] overflow-hidden rounded-md border border-neutral-200 bg-white py-1 shadow-lg", c), children: d.map((t, o) => /* @__PURE__ */ n(v.Fragment, { children: [
      o > 0 && /* @__PURE__ */ r(y, { className: "my-1" }),
      t.label && /* @__PURE__ */ r("p", { className: "px-3 py-1 text-xs font-semibold text-neutral-500 uppercase tracking-wide", children: t.label }),
      t.items.map((e, b) => /* @__PURE__ */ n(
        N,
        {
          variant: "ghost",
          role: "menuitem",
          type: "button",
          "aria-disabled": e.disabled || void 0,
          onClick: () => {
            if (e.disabled) {
              a == null || a(e.label);
              return;
            }
            x(e);
          },
          className: l(
            "w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:bg-neutral-100",
            e.disabled && "cursor-not-allowed opacity-50",
            e.variant === "destructive" ? "text-danger-500 hover:bg-red-50" : "text-neutral-700 hover:bg-neutral-100"
          ),
          children: [
            e.icon && /* @__PURE__ */ r("span", { className: "w-4 h-4 shrink-0", "aria-hidden": "true", children: e.icon }),
            /* @__PURE__ */ r("span", { className: "min-w-0 flex-1 truncate", children: e.label }),
            e.shortcut && /* @__PURE__ */ r("span", { className: "ml-auto shrink-0 text-xs text-neutral-400", children: e.shortcut })
          ]
        },
        b
      ))
    ] }, o)) }),
    document.body
  )
] });
export {
  R as DropdownMoleculeView
};
//# sourceMappingURL=DropdownMoleculeView.js.map
