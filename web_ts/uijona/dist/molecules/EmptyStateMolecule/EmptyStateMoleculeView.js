import { jsxs as s, jsx as e } from "react/jsx-runtime";
import { cn as i } from "../../lib/cn.js";
import { PanelAtomImpl as n } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { ButtonAtomImpl as p } from "../../atoms/ButtonAtom/ButtonAtomImpl.js";
const h = ({
  icon: a,
  title: o,
  description: l,
  actions: r,
  className: d,
  ...m
}) => /* @__PURE__ */ s(
  n,
  {
    variant: "ghost",
    padding: "none",
    radius: "none",
    className: i("flex w-full min-w-0 flex-col items-center justify-center gap-4 rounded-md border border-dashed border-neutral-300 bg-white px-4 py-8 text-center sm:px-6 sm:py-10", d),
    ...m,
    children: [
      a && /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: "flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500", children: a }),
      /* @__PURE__ */ s(n, { variant: "ghost", padding: "none", radius: "none", className: "flex max-w-md min-w-0 flex-col gap-1", children: [
        /* @__PURE__ */ e("h3", { className: "break-words text-base font-semibold text-neutral-900", children: o }),
        l && /* @__PURE__ */ e("p", { className: "break-words text-sm text-neutral-500", children: l })
      ] }),
      r && r.length > 0 && /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: "flex flex-wrap items-center justify-center gap-2", children: r.map((t) => /* @__PURE__ */ e(
        p,
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
  h as EmptyStateMoleculeView
};
//# sourceMappingURL=EmptyStateMoleculeView.js.map
