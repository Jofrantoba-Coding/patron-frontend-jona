import { jsxs as n, jsx as e } from "react/jsx-runtime";
import { cn as c } from "../../lib/cn.js";
import { ButtonAtomImpl as i } from "../../atoms/ButtonAtom/ButtonAtomImpl.js";
const u = ({
  icon: r,
  title: d,
  description: a,
  actions: l,
  className: m,
  ...s
}) => /* @__PURE__ */ n(
  "div",
  {
    className: c("flex w-full flex-col items-center justify-center gap-4 rounded-md border border-dashed border-neutral-300 bg-white px-6 py-10 text-center", m),
    ...s,
    children: [
      r && /* @__PURE__ */ e("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500", children: r }),
      /* @__PURE__ */ n("div", { className: "flex max-w-md flex-col gap-1", children: [
        /* @__PURE__ */ e("h3", { className: "text-base font-semibold text-neutral-900", children: d }),
        a && /* @__PURE__ */ e("p", { className: "text-sm text-neutral-500", children: a })
      ] }),
      l && l.length > 0 && /* @__PURE__ */ e("div", { className: "flex flex-wrap items-center justify-center gap-2", children: l.map((t) => /* @__PURE__ */ e(
        i,
        {
          type: "button",
          variant: t.variant === "secondary" ? "outline" : "default",
          onClick: t.onClick,
          children: t.label
        },
        t.label
      )) })
    ]
  }
);
export {
  u as EmptyStateMoleculeView
};
//# sourceMappingURL=EmptyStateMoleculeView.js.map
