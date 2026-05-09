import { jsx as n, jsxs as a } from "react/jsx-runtime";
import { cn as i } from "../../lib/cn.js";
const p = ({
  items: o,
  openValues: d,
  className: s,
  onItemToggle: c
}) => /* @__PURE__ */ n("div", { className: i("w-full divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-white", s), children: o.map((e) => {
  const r = d.includes(e.value), l = `accordion-trigger-${e.value}`, t = `accordion-panel-${e.value}`;
  return /* @__PURE__ */ a("div", { children: [
    /* @__PURE__ */ n("h3", { children: /* @__PURE__ */ a(
      "button",
      {
        id: l,
        type: "button",
        "aria-expanded": r,
        "aria-controls": t,
        disabled: e.disabled,
        onClick: () => c(e),
        className: i(
          "flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-neutral-900",
          "transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500",
          "disabled:cursor-not-allowed disabled:opacity-50"
        ),
        children: [
          /* @__PURE__ */ n("span", { children: e.title }),
          /* @__PURE__ */ n("span", { "aria-hidden": "true", className: i("text-neutral-500 transition-transform", r && "rotate-180"), children: "▾" })
        ]
      }
    ) }),
    r && /* @__PURE__ */ n(
      "div",
      {
        id: t,
        role: "region",
        "aria-labelledby": l,
        className: "px-4 pb-4 text-sm text-neutral-600",
        children: e.content
      }
    )
  ] }, e.value);
}) });
export {
  p as AccordionMoleculeView
};
//# sourceMappingURL=AccordionMoleculeView.js.map
