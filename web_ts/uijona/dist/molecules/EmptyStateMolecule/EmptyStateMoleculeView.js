import { jsxs as m, jsx as e } from "react/jsx-runtime";
import { cn as i } from "../../lib/cn.js";
import { ButtonAtomImpl as c } from "../../atoms/ButtonAtom/ButtonAtomImpl.js";
const u = ({
  icon: r,
  title: n,
  description: a,
  actions: l,
  className: s,
  ...d
}) => /* @__PURE__ */ m(
  "div",
  {
    className: i("flex w-full min-w-0 flex-col items-center justify-center gap-4 rounded-md border border-dashed border-neutral-300 bg-white px-4 py-8 text-center sm:px-6 sm:py-10", s),
    ...d,
    children: [
      r && /* @__PURE__ */ e("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500", children: r }),
      /* @__PURE__ */ m("div", { className: "flex max-w-md min-w-0 flex-col gap-1", children: [
        /* @__PURE__ */ e("h3", { className: "break-words text-base font-semibold text-neutral-900", children: n }),
        a && /* @__PURE__ */ e("p", { className: "break-words text-sm text-neutral-500", children: a })
      ] }),
      l && l.length > 0 && /* @__PURE__ */ e("div", { className: "flex flex-wrap items-center justify-center gap-2", children: l.map((t) => /* @__PURE__ */ e(
        c,
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
