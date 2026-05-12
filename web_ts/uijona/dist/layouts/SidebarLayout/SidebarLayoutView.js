import { jsxs as a, jsx as e } from "react/jsx-runtime";
import { cn as l } from "../../lib/cn.js";
import { PanelAtomImpl as i } from "../../atoms/PanelAtom/PanelAtomImpl.js";
function k({ group: s, activeKey: o, collapsed: t, onItemClick: c }) {
  return /* @__PURE__ */ a(i, { variant: "ghost", padding: "none", radius: "none", className: "flex flex-col gap-0.5", children: [
    s.label && !t && /* @__PURE__ */ e("p", { className: "px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-neutral-400", children: s.label }),
    s.items.map((n) => {
      const d = n.key === o;
      return /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          onClick: () => c(n),
          "aria-current": d ? "page" : void 0,
          title: t ? n.label : void 0,
          className: l(
            "flex min-w-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
            d ? "bg-primary-50 text-primary-700" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          ),
          children: [
            n.icon && /* @__PURE__ */ e("span", { className: "shrink-0", "aria-hidden": "true", children: n.icon }),
            !t && /* @__PURE__ */ e("span", { className: "min-w-0 flex-1 truncate text-left", children: n.label }),
            !t && n.badge !== void 0 && /* @__PURE__ */ e("span", { className: "ml-auto shrink-0 rounded-full bg-primary-100 px-1.5 py-0.5 text-xs font-semibold text-primary-700", children: n.badge })
          ]
        },
        n.key
      );
    })
  ] });
}
const z = ({
  nav: s,
  header: o,
  footer: t,
  children: c,
  activeKey: n,
  collapsible: d,
  collapsed: r,
  mobileOpen: u,
  sidebarWidth: x = "16rem",
  className: h,
  sidebarClassName: m,
  onToggleCollapse: p,
  onToggleMobile: f,
  onCloseMobile: b,
  onItemClick: g
}) => {
  const v = r ? "3.5rem" : x;
  return /* @__PURE__ */ a(i, { variant: "ghost", padding: "none", radius: "none", className: l("flex min-h-screen min-w-0 bg-neutral-50", h), children: [
    u && /* @__PURE__ */ e(i, { variant: "ghost", padding: "none", radius: "none", className: "fixed inset-0 z-30 bg-black/40 lg:hidden", "aria-hidden": "true", onClick: b }),
    /* @__PURE__ */ a(
      "aside",
      {
        style: { width: v },
        className: l(
          "fixed inset-y-0 left-0 z-40 flex shrink-0 flex-col border-r border-neutral-200 bg-white transition-all duration-300 ease-in-out",
          "lg:static lg:z-auto",
          u ? "translate-x-0 shadow-xl" : "-translate-x-full lg:translate-x-0",
          m
        ),
        children: [
          o && /* @__PURE__ */ e(i, { variant: "ghost", padding: "none", radius: "none", className: l("flex shrink-0 items-center border-b border-neutral-100 px-3 py-3", r && "justify-center"), children: o }),
          /* @__PURE__ */ e("nav", { className: "flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2", children: s.map((y, N) => /* @__PURE__ */ e(k, { group: y, activeKey: n, collapsed: r, onItemClick: g }, N)) }),
          /* @__PURE__ */ a(i, { variant: "ghost", padding: "none", radius: "none", className: "flex shrink-0 flex-col border-t border-neutral-100 p-2 gap-1", children: [
            t && !r && /* @__PURE__ */ e(i, { variant: "ghost", padding: "none", radius: "none", className: "min-w-0 px-1 py-1", children: t }),
            d && /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                onClick: p,
                "aria-label": r ? "Expandir sidebar" : "Colapsar sidebar",
                className: l(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                  r && "justify-center"
                ),
                children: [
                  /* @__PURE__ */ e("svg", { className: l("h-4 w-4 shrink-0 transition-transform", r && "rotate-180"), viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ e("polyline", { points: "15 18 9 12 15 6" }) }),
                  !r && /* @__PURE__ */ e("span", { children: "Colapsar" })
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ a(i, { variant: "ghost", padding: "none", radius: "none", className: "flex min-w-0 flex-1 flex-col overflow-hidden", children: [
      /* @__PURE__ */ e(i, { variant: "ghost", padding: "none", radius: "none", className: "flex shrink-0 items-center border-b border-neutral-200 bg-white px-4 py-3 lg:hidden", children: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          onClick: f,
          "aria-label": "Abrir menú",
          "aria-expanded": u,
          className: "mr-3 rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          children: /* @__PURE__ */ a("svg", { className: "h-5 w-5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: [
            /* @__PURE__ */ e("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
            /* @__PURE__ */ e("line", { x1: "3", y1: "12", x2: "21", y2: "12" }),
            /* @__PURE__ */ e("line", { x1: "3", y1: "18", x2: "21", y2: "18" })
          ] })
        }
      ) }),
      /* @__PURE__ */ e("main", { className: "min-h-0 flex-1 overflow-auto p-4 sm:p-6", children: c })
    ] })
  ] });
};
export {
  z as SidebarLayoutView
};
//# sourceMappingURL=SidebarLayoutView.js.map
