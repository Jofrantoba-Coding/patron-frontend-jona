import { jsxs as p, Fragment as R, jsx as a } from "react/jsx-runtime";
import L, { useState as h, useRef as x, useEffect as j } from "react";
import { createPortal as F } from "react-dom";
import { cn as b } from "../lib/cn.js";
import { SeparatorAtom as M } from "../atoms/SeparatorAtom.js";
const K = ({ trigger: g, groups: v, align: w = "start", className: y, onOpen: u, onClose: t, onItemSelect: l, onDisabledItemClick: o }) => {
  const [f, s] = h(!1), [N, k] = h({}), c = x(null), m = x(null), E = () => {
    if (!c.current) return;
    const r = c.current.getBoundingClientRect();
    k({ position: "fixed", top: r.bottom + 4, ...w === "end" ? { right: window.innerWidth - r.right } : { left: r.left }, minWidth: r.width, zIndex: 50 });
  };
  return j(() => {
    if (!f) return;
    const r = (e) => {
      e.key === "Escape" && (s(!1), t == null || t());
    }, n = (e) => {
      var d, i;
      !((d = c.current) != null && d.contains(e.target)) && !((i = m.current) != null && i.contains(e.target)) && (s(!1), t == null || t());
    };
    return document.addEventListener("keydown", r), document.addEventListener("mousedown", n), () => {
      document.removeEventListener("keydown", r), document.removeEventListener("mousedown", n);
    };
  }, [f, t]), /* @__PURE__ */ p(R, { children: [
    /* @__PURE__ */ a("div", { ref: c, className: "inline-block", onClick: () => {
      E(), s((r) => {
        const n = !r;
        return n ? u == null || u() : t == null || t(), n;
      });
    }, children: g }),
    f && F(
      /* @__PURE__ */ a("div", { ref: m, role: "menu", style: N, className: b("bg-white border border-neutral-200 rounded-md shadow-lg py-1 min-w-[160px] max-w-xs", y), children: v.map((r, n) => /* @__PURE__ */ p(L.Fragment, { children: [
        n > 0 && /* @__PURE__ */ a(M, { className: "my-1" }),
        r.label && /* @__PURE__ */ a("p", { className: "px-3 py-1 text-xs font-semibold text-neutral-500 uppercase tracking-wide", children: r.label }),
        r.items.map((e, d) => /* @__PURE__ */ p(
          "button",
          {
            role: "menuitem",
            type: "button",
            disabled: e.disabled,
            onClick: () => {
              var i;
              if (e.disabled) {
                o == null || o(e.label);
                return;
              }
              (i = e.onClick) == null || i.call(e), l == null || l(e.label), s(!1), t == null || t();
            },
            className: b("w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:bg-neutral-100 disabled:pointer-events-none disabled:opacity-50", e.variant === "destructive" ? "text-danger-500 hover:bg-red-50" : "text-neutral-700 hover:bg-neutral-100"),
            children: [
              e.icon && /* @__PURE__ */ a("span", { className: "w-4 h-4 shrink-0", "aria-hidden": "true", children: e.icon }),
              /* @__PURE__ */ a("span", { className: "flex-1", children: e.label }),
              e.shortcut && /* @__PURE__ */ a("span", { className: "text-xs text-neutral-400 ml-auto", children: e.shortcut })
            ]
          },
          d
        ))
      ] }, n)) }),
      document.body
    )
  ] });
};
export {
  K as DropdownMolecule
};
//# sourceMappingURL=DropdownMolecule.js.map
