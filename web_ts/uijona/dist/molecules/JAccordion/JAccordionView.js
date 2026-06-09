import { jsx as n, jsxs as r } from "react/jsx-runtime";
import { cn as a } from "../../lib/cn.js";
import { JPanelImpl as o } from "../../atoms/JPanel/JPanelImpl.js";
const v = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-3 text-sm",
  lg: "px-5 py-4 text-base"
}, N = {
  sm: "px-3 pb-2 text-xs",
  md: "px-4 pb-4 text-sm",
  lg: "px-5 pb-5 text-base"
}, y = {
  default: "w-full divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-white",
  bordered: "w-full flex flex-col gap-2",
  ghost: "w-full divide-y divide-neutral-100"
}, w = {
  default: "",
  bordered: "rounded-md border border-neutral-200 bg-white overflow-hidden",
  ghost: ""
}, E = ({
  items: c,
  openValues: u,
  className: p,
  style: b,
  onItemToggle: h,
  variant: l = "default",
  size: d = "md",
  headerClassName: x,
  headerStyle: f,
  contentClassName: m,
  contentStyle: g
}) => /* @__PURE__ */ n(
  o,
  {
    variant: "ghost",
    padding: "none",
    className: a(y[l], p),
    style: b,
    children: c.map((e) => {
      const t = u.includes(e.value), s = `jaccordion-trigger-${e.value}`, i = `jaccordion-panel-${e.value}`;
      return /* @__PURE__ */ r(
        o,
        {
          variant: "ghost",
          padding: "none",
          className: w[l],
          children: [
            /* @__PURE__ */ n("h3", { children: /* @__PURE__ */ r(
              "button",
              {
                id: s,
                type: "button",
                "aria-expanded": t,
                "aria-controls": i,
                disabled: e.disabled,
                onClick: () => h(e),
                style: { ...f, ...e.headerStyle },
                className: a(
                  "flex w-full items-center justify-between gap-3 text-left font-medium text-neutral-900",
                  "transition-colors hover:bg-neutral-50",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  v[d],
                  x,
                  e.headerClassName
                ),
                children: [
                  /* @__PURE__ */ r("span", { className: "flex min-w-0 items-center gap-2", children: [
                    e.icon && /* @__PURE__ */ n("span", { className: "shrink-0 text-neutral-500", "aria-hidden": "true", children: e.icon }),
                    /* @__PURE__ */ n("span", { className: "truncate", children: e.title })
                  ] }),
                  /* @__PURE__ */ n(
                    "span",
                    {
                      "aria-hidden": "true",
                      className: a(
                        "shrink-0 text-neutral-400 transition-transform duration-200",
                        t && "rotate-180"
                      ),
                      children: "▾"
                    }
                  )
                ]
              }
            ) }),
            /* @__PURE__ */ n(
              "div",
              {
                id: i,
                role: "region",
                "aria-labelledby": s,
                "aria-hidden": !t,
                style: {
                  display: "grid",
                  gridTemplateRows: t ? "1fr" : "0fr",
                  transition: "grid-template-rows 200ms ease"
                },
                children: t && /* @__PURE__ */ n("div", { className: "overflow-hidden", children: /* @__PURE__ */ n(
                  "div",
                  {
                    style: { ...g, ...e.contentStyle },
                    className: a("text-neutral-600", N[d], m, e.contentClassName),
                    children: e.content
                  }
                ) })
              }
            )
          ]
        },
        e.value
      );
    })
  }
);
export {
  E as JAccordionView
};
//# sourceMappingURL=JAccordionView.js.map
