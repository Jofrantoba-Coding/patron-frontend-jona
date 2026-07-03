import { jsxs as o, jsx as e } from "react/jsx-runtime";
import { cn as l } from "../../lib/cn.js";
const m = ({
  name: s,
  outcome: t,
  href: r,
  linkLabel: i,
  className: n
}) => /* @__PURE__ */ o(
  "a",
  {
    href: r,
    className: l(
      "flex min-w-0 flex-col gap-1.5 rounded-xl border border-neutral-200 bg-white p-5 no-underline transition-shadow duration-200 hover:shadow-md",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500",
      n
    ),
    children: [
      /* @__PURE__ */ e("strong", { className: "text-base font-bold text-neutral-900", children: s }),
      /* @__PURE__ */ e("span", { className: "text-sm leading-relaxed text-neutral-500", children: t }),
      /* @__PURE__ */ e("span", { className: "mt-1 text-sm font-semibold text-primary-600", children: i })
    ]
  }
);
export {
  m as JRelatedItemView
};
//# sourceMappingURL=JRelatedItemView.js.map
