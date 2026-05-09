import { jsxs as l, Fragment as f, jsx as r } from "react/jsx-runtime";
import w from "react";
import { createPortal as v } from "react-dom";
import { cn as o } from "../../lib/cn.js";
import { SeparatorAtomImpl as y } from "../../atoms/SeparatorAtom/SeparatorAtomImpl.js";
const A = ({
  trigger: s,
  groups: c,
  className: d,
  open: i,
  menuStyle: u,
  triggerRef: m,
  menuRef: p,
  onTriggerClick: h,
  onItemClick: x,
  onDisabledItemClick: a
}) => /* @__PURE__ */ l(f, { children: [
  /* @__PURE__ */ r("div", { ref: m, className: "inline-block", onClick: h, children: s }),
  i && v(
    /* @__PURE__ */ r("div", { ref: p, role: "menu", style: u, className: o("max-w-[calc(100vw-1rem)] overflow-hidden rounded-md border border-neutral-200 bg-white py-1 shadow-lg", d), children: c.map((t, n) => /* @__PURE__ */ l(w.Fragment, { children: [
      n > 0 && /* @__PURE__ */ r(y, { className: "my-1" }),
      t.label && /* @__PURE__ */ r("p", { className: "px-3 py-1 text-xs font-semibold text-neutral-500 uppercase tracking-wide", children: t.label }),
      t.items.map((e, b) => /* @__PURE__ */ l(
        "button",
        {
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
          className: o(
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
    ] }, n)) }),
    document.body
  )
] });
export {
  A as DropdownMoleculeView
};
//# sourceMappingURL=DropdownMoleculeView.js.map
