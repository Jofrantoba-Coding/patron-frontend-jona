import { jsx as n, jsxs as l } from "react/jsx-runtime";
import { cn as a } from "../../lib/cn.js";
import { JPanelImpl as i } from "../../atoms/JPanel/JPanelImpl.js";
const f = ({
  items: d,
  openValues: s,
  className: c,
  onItemToggle: u
}) => /* @__PURE__ */ n(i, { variant: "ghost", padding: "none", radius: "none", className: a("w-full divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-white", c), children: d.map((e) => {
  const r = s.includes(e.value), o = `accordion-trigger-${e.value}`, t = `accordion-panel-${e.value}`;
  return /* @__PURE__ */ l(i, { variant: "ghost", padding: "none", radius: "none", children: [
    /* @__PURE__ */ n("h3", { children: /* @__PURE__ */ l(
      "button",
      {
        id: o,
        type: "button",
        "aria-expanded": r,
        "aria-controls": t,
        disabled: e.disabled,
        onClick: () => u(e),
        className: a(
          "flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-neutral-900",
          "transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500",
          "disabled:cursor-not-allowed disabled:opacity-50"
        ),
        children: [
          /* @__PURE__ */ n("span", { children: e.title }),
          /* @__PURE__ */ n("span", { "aria-hidden": "true", className: a("text-neutral-500 transition-transform", r && "rotate-180"), children: "▾" })
        ]
      }
    ) }),
    r && /* @__PURE__ */ n(
      i,
      {
        variant: "ghost",
        padding: "none",
        radius: "none",
        id: t,
        role: "region",
        "aria-labelledby": o,
        className: "px-4 pb-4 text-sm text-neutral-600",
        children: e.content
      }
    )
  ] }, e.value);
}) });
export {
  f as AccordionMoleculeView
};
//# sourceMappingURL=AccordionMoleculeView.js.map
