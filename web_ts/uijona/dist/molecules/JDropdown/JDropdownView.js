import { jsxs as l, Fragment as b, jsx as r } from "react/jsx-runtime";
import v from "react";
import { createPortal as w } from "react-dom";
import { cn as o } from "../../lib/cn.js";
import { JSeparatorImpl as g } from "../../atoms/JSeparator/JSeparatorImpl.js";
import { JButtonImpl as y } from "../../atoms/JButton/JButtonImpl.js";
const P = ({
  trigger: s,
  groups: c,
  className: i,
  open: d,
  menuStyle: m,
  triggerRef: p,
  menuRef: u,
  onTriggerClick: h,
  onItemClick: x,
  onDisabledItemClick: a
}) => /* @__PURE__ */ l(b, { children: [
  /* @__PURE__ */ r("div", { ref: p, className: "inline-block", onClick: h, children: s }),
  d && w(
    /* @__PURE__ */ r(
      "div",
      {
        ref: u,
        role: "menu",
        style: m,
        className: o(
          "max-w-[calc(100vw-1rem)] overflow-hidden rounded-md border border-neutral-200 bg-white py-1 shadow-lg",
          i
        ),
        children: c.map((t, n) => /* @__PURE__ */ l(v.Fragment, { children: [
          n > 0 && /* @__PURE__ */ r(g, { className: "my-1" }),
          t.label && /* @__PURE__ */ r("p", { className: "px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-500", children: t.label }),
          t.items.map((e, f) => /* @__PURE__ */ l(
            y,
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
              className: o(
                "flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors duration-150 focus-visible:bg-neutral-100 focus-visible:outline-none",
                e.disabled && "cursor-not-allowed opacity-50",
                e.variant === "destructive" ? "text-danger-500 hover:bg-red-50" : "text-neutral-700 hover:bg-neutral-100"
              ),
              children: [
                e.icon && /* @__PURE__ */ r("span", { className: "h-4 w-4 shrink-0", "aria-hidden": "true", children: e.icon }),
                /* @__PURE__ */ r("span", { className: "min-w-0 flex-1 truncate", children: e.label }),
                e.shortcut && /* @__PURE__ */ r("span", { className: "ml-auto shrink-0 text-xs text-neutral-400", children: e.shortcut })
              ]
            },
            f
          ))
        ] }, n))
      }
    ),
    document.body
  )
] });
export {
  P as JDropdownView
};
//# sourceMappingURL=JDropdownView.js.map
