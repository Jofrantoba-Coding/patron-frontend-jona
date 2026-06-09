import { jsxs as i, jsx as e } from "react/jsx-runtime";
import { cn as s } from "../../lib/cn.js";
import { JPanelImpl as n } from "../../atoms/JPanel/JPanelImpl.js";
function N({ group: l, activeKey: o, collapsed: a, onItemClick: d }) {
  return /* @__PURE__ */ i(n, { children: [
    l.label && !a && /* @__PURE__ */ e("p", { className: "px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-neutral-400", children: l.label }),
    l.items.map((r) => {
      const c = r.key === o;
      return /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          onClick: () => d(r),
          "aria-current": c ? "page" : void 0,
          title: a ? r.label : void 0,
          className: s(
            "flex min-w-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
            c ? "bg-primary-50 text-primary-700" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          ),
          children: [
            r.icon && /* @__PURE__ */ e("span", { className: "shrink-0", "aria-hidden": "true", children: r.icon }),
            !a && /* @__PURE__ */ e("span", { className: "min-w-0 flex-1 truncate text-left", children: r.label }),
            !a && r.badge !== void 0 && /* @__PURE__ */ e("span", { className: "ml-auto shrink-0 rounded-full bg-primary-100 px-1.5 py-0.5 text-xs font-semibold text-primary-700", children: r.badge })
          ]
        },
        r.key
      );
    })
  ] });
}
const z = ({
  nav: l,
  header: o,
  footer: a,
  children: d,
  activeKey: r,
  collapsible: c,
  collapsed: t,
  mobileOpen: u,
  sidebarWidth: x = "16rem",
  className: b,
  sidebarClassName: m,
  onToggleCollapse: h,
  onToggleMobile: p,
  onCloseMobile: y,
  onItemClick: f
}) => {
  const g = t ? "3.5rem" : x;
  return /* @__PURE__ */ i(
    n,
    {
      layout: "box",
      direction: "row",
      className: s("min-h-screen bg-neutral-50", b),
      children: [
        u && /* @__PURE__ */ e(
          n,
          {
            className: "fixed inset-0 z-30 bg-black/40 lg:hidden",
            "aria-hidden": "true",
            onClick: y
          }
        ),
        /* @__PURE__ */ i(
          n,
          {
            as: "aside",
            layout: "box",
            style: { width: g },
            className: s(
              "fixed inset-y-0 left-0 z-40 shrink-0 border-r border-neutral-200 bg-white transition-all duration-300 ease-in-out",
              "lg:static lg:z-auto",
              u ? "translate-x-0 shadow-xl" : "-translate-x-full lg:translate-x-0",
              m
            ),
            children: [
              o && /* @__PURE__ */ e(
                n,
                {
                  layout: "box",
                  direction: "row",
                  alignItems: "center",
                  justifyContent: t ? "center" : "start",
                  className: "shrink-0 border-b border-neutral-100 px-3 py-3",
                  children: o
                }
              ),
              /* @__PURE__ */ e(
                n,
                {
                  as: "nav",
                  layout: "box",
                  gap: "xs",
                  className: "min-h-0 flex-1 overflow-y-auto p-2",
                  children: l.map((v, w) => /* @__PURE__ */ e(N, { group: v, activeKey: r, collapsed: t, onItemClick: f }, w))
                }
              ),
              /* @__PURE__ */ i(
                n,
                {
                  layout: "box",
                  gap: "xs",
                  className: "shrink-0 border-t border-neutral-100 p-2",
                  children: [
                    a && !t && /* @__PURE__ */ e(n, { className: "min-w-0 px-1 py-1", children: a }),
                    c && /* @__PURE__ */ i(
                      "button",
                      {
                        type: "button",
                        onClick: h,
                        "aria-label": t ? "Expandir sidebar" : "Colapsar sidebar",
                        className: s(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                          t && "justify-center"
                        ),
                        children: [
                          /* @__PURE__ */ e("svg", { className: s("h-4 w-4 shrink-0 transition-transform", t && "rotate-180"), viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ e("polyline", { points: "15 18 9 12 15 6" }) }),
                          !t && /* @__PURE__ */ e("span", { children: "Colapsar" })
                        ]
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ i(
          n,
          {
            layout: "box",
            className: "min-w-0 flex-1 overflow-hidden",
            children: [
              /* @__PURE__ */ e(
                n,
                {
                  layout: "box",
                  direction: "row",
                  alignItems: "center",
                  className: "shrink-0 border-b border-neutral-200 bg-white px-4 py-3 lg:hidden",
                  children: /* @__PURE__ */ e(
                    "button",
                    {
                      type: "button",
                      onClick: p,
                      "aria-label": "Abrir menú",
                      "aria-expanded": u,
                      className: "mr-3 rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                      children: /* @__PURE__ */ i("svg", { className: "h-5 w-5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: [
                        /* @__PURE__ */ e("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
                        /* @__PURE__ */ e("line", { x1: "3", y1: "12", x2: "21", y2: "12" }),
                        /* @__PURE__ */ e("line", { x1: "3", y1: "18", x2: "21", y2: "18" })
                      ] })
                    }
                  )
                }
              ),
              /* @__PURE__ */ e(
                n,
                {
                  as: "main",
                  layout: "box",
                  className: "min-h-0 flex-1 overflow-auto p-4 sm:p-6",
                  children: d
                }
              )
            ]
          }
        )
      ]
    }
  );
};
export {
  z as JSidebarLayoutView
};
//# sourceMappingURL=JSidebarLayoutView.js.map
