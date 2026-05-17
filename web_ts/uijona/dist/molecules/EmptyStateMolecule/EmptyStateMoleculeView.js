import { jsxs as s, jsx as e } from "react/jsx-runtime";
import { cn as m } from "../../lib/cn.js";
import { JPanelImpl as t } from "../../atoms/JPanel/JPanelImpl.js";
import { JButtonImpl as p } from "../../atoms/JButton/JButtonImpl.js";
const h = ({
  icon: a,
  title: d,
  description: l,
  actions: r,
  className: o,
  ...i
}) => /* @__PURE__ */ s(
  t,
  {
    variant: "ghost",
    padding: "none",
    radius: "none",
    className: m("flex w-full min-w-0 flex-col items-center justify-center gap-4 rounded-md border border-dashed border-neutral-300 bg-white px-4 py-8 text-center sm:px-6 sm:py-10", o),
    ...i,
    children: [
      a && /* @__PURE__ */ e(t, { variant: "ghost", padding: "none", radius: "none", className: "flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500", children: a }),
      /* @__PURE__ */ s(t, { variant: "ghost", padding: "none", radius: "none", className: "flex max-w-md min-w-0 flex-col gap-1", children: [
        /* @__PURE__ */ e("h3", { className: "break-words text-base font-semibold text-neutral-900", children: d }),
        l && /* @__PURE__ */ e("p", { className: "break-words text-sm text-neutral-500", children: l })
      ] }),
      r && r.length > 0 && /* @__PURE__ */ e(t, { variant: "ghost", padding: "none", radius: "none", className: "flex flex-wrap items-center justify-center gap-2", children: r.map((n) => /* @__PURE__ */ e(
        p,
        {
          type: "button",
          variant: n.variant === "secondary" ? "outline" : "default",
          onClick: n.onClick,
          children: n.label
        },
        n.label
      )) })
    ]
  }
);
export {
  h as EmptyStateMoleculeView
};
//# sourceMappingURL=EmptyStateMoleculeView.js.map
