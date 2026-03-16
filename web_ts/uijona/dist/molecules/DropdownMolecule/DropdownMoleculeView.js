import { jsxs as l, Fragment as f, jsx as r } from "react/jsx-runtime";
import v from "react";
import { createPortal as w } from "react-dom";
import { cn as o } from "../../lib/cn.js";
import { SeparatorAtomImpl as y } from "../../atoms/SeparatorAtom/SeparatorAtomImpl.js";
const A = ({
  trigger: s,
  groups: c,
  className: i,
  open: d,
  menuStyle: p,
  triggerRef: m,
  menuRef: u,
  onTriggerClick: x,
  onItemClick: b,
  onDisabledItemClick: t
}) => /* @__PURE__ */ l(f, { children: [
  /* @__PURE__ */ r("div", { ref: m, className: "inline-block", onClick: x, children: s }),
  d && w(
    /* @__PURE__ */ r("div", { ref: u, role: "menu", style: p, className: o("bg-white border border-neutral-200 rounded-md shadow-lg py-1 min-w-[160px] max-w-xs", i), children: c.map((a, n) => /* @__PURE__ */ l(v.Fragment, { children: [
      n > 0 && /* @__PURE__ */ r(y, { className: "my-1" }),
      a.label && /* @__PURE__ */ r("p", { className: "px-3 py-1 text-xs font-semibold text-neutral-500 uppercase tracking-wide", children: a.label }),
      a.items.map((e, h) => /* @__PURE__ */ l(
        "button",
        {
          role: "menuitem",
          type: "button",
          disabled: e.disabled,
          onClick: () => {
            if (e.disabled) {
              t == null || t(e.label);
              return;
            }
            b(e);
          },
          className: o(
            "w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:bg-neutral-100 disabled:pointer-events-none disabled:opacity-50",
            e.variant === "destructive" ? "text-danger-500 hover:bg-red-50" : "text-neutral-700 hover:bg-neutral-100"
          ),
          children: [
            e.icon && /* @__PURE__ */ r("span", { className: "w-4 h-4 shrink-0", "aria-hidden": "true", children: e.icon }),
            /* @__PURE__ */ r("span", { className: "flex-1", children: e.label }),
            e.shortcut && /* @__PURE__ */ r("span", { className: "text-xs text-neutral-400 ml-auto", children: e.shortcut })
          ]
        },
        h
      ))
    ] }, n)) }),
    document.body
  )
] });
export {
  A as DropdownMoleculeView
};
//# sourceMappingURL=DropdownMoleculeView.js.map
