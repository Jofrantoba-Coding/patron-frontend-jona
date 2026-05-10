import { jsxs as n, jsx as e } from "react/jsx-runtime";
import { cn as a } from "../../lib/cn.js";
function N({ group: l, activeKey: s, collapsed: t, onItemClick: c }) {
  return /* @__PURE__ */ n("div", { className: "flex flex-col gap-0.5", children: [
    l.label && !t && /* @__PURE__ */ e("p", { className: "px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-neutral-400", children: l.label }),
    l.items.map((r) => {
      const o = r.key === s;
      return /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => c(r),
          "aria-current": o ? "page" : void 0,
          title: t ? r.label : void 0,
          className: a(
            "flex min-w-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
            o ? "bg-primary-50 text-primary-700" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          ),
          children: [
            r.icon && /* @__PURE__ */ e("span", { className: "shrink-0", "aria-hidden": "true", children: r.icon }),
            !t && /* @__PURE__ */ e("span", { className: "min-w-0 flex-1 truncate text-left", children: r.label }),
            !t && r.badge !== void 0 && /* @__PURE__ */ e("span", { className: "ml-auto shrink-0 rounded-full bg-primary-100 px-1.5 py-0.5 text-xs font-semibold text-primary-700", children: r.badge })
          ]
        },
        r.key
      );
    })
  ] });
}
const C = ({
  nav: l,
  header: s,
  footer: t,
  children: c,
  activeKey: r,
  collapsible: o,
  collapsed: i,
  mobileOpen: d,
  sidebarWidth: u = "16rem",
  className: x,
  sidebarClassName: m,
  onToggleCollapse: f,
  onToggleMobile: h,
  onCloseMobile: b,
  onItemClick: p
}) => {
  const v = i ? "3.5rem" : u;
  return /* @__PURE__ */ n("div", { className: a("flex min-h-screen min-w-0 bg-neutral-50", x), children: [
    d && /* @__PURE__ */ e("div", { className: "fixed inset-0 z-30 bg-black/40 lg:hidden", "aria-hidden": "true", onClick: b }),
    /* @__PURE__ */ n(
      "aside",
      {
        style: { width: v },
        className: a(
          "fixed inset-y-0 left-0 z-40 flex shrink-0 flex-col border-r border-neutral-200 bg-white transition-all duration-300 ease-in-out",
          "lg:static lg:z-auto",
          d ? "translate-x-0 shadow-xl" : "-translate-x-full lg:translate-x-0",
          m
        ),
        children: [
          s && /* @__PURE__ */ e("div", { className: a("flex shrink-0 items-center border-b border-neutral-100 px-3 py-3", i && "justify-center"), children: s }),
          /* @__PURE__ */ e("nav", { className: "flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2", children: l.map((y, g) => /* @__PURE__ */ e(N, { group: y, activeKey: r, collapsed: i, onItemClick: p }, g)) }),
          /* @__PURE__ */ n("div", { className: "flex shrink-0 flex-col border-t border-neutral-100 p-2 gap-1", children: [
            t && !i && /* @__PURE__ */ e("div", { className: "min-w-0 px-1 py-1", children: t }),
            o && /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: f,
                "aria-label": i ? "Expandir sidebar" : "Colapsar sidebar",
                className: a(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                  i && "justify-center"
                ),
                children: [
                  /* @__PURE__ */ e("svg", { className: a("h-4 w-4 shrink-0 transition-transform", i && "rotate-180"), viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ e("polyline", { points: "15 18 9 12 15 6" }) }),
                  !i && /* @__PURE__ */ e("span", { children: "Colapsar" })
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ n("div", { className: "flex min-w-0 flex-1 flex-col overflow-hidden", children: [
      /* @__PURE__ */ e("div", { className: "flex shrink-0 items-center border-b border-neutral-200 bg-white px-4 py-3 lg:hidden", children: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          onClick: h,
          "aria-label": "Abrir menú",
          "aria-expanded": d,
          className: "mr-3 rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          children: /* @__PURE__ */ n("svg", { className: "h-5 w-5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: [
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
  C as SidebarLayoutView
};
//# sourceMappingURL=SidebarLayoutView.js.map
