import { jsxs as a, jsx as e } from "react/jsx-runtime";
import { cn as m } from "../../lib/cn.js";
const x = ({
  icon: t,
  label: n,
  description: s,
  href: i,
  actionLabel: r,
  isPrimary: o,
  className: l
}) => /* @__PURE__ */ a(
  "div",
  {
    className: m(
      "flex min-w-0 flex-col gap-2.5 rounded-2xl border p-7 transition-shadow duration-200 hover:shadow-lg",
      o ? "border-primary-500 bg-primary-50" : "border-neutral-200 bg-neutral-50",
      l
    ),
    children: [
      /* @__PURE__ */ e("span", { className: "text-3xl leading-none", "aria-hidden": "true", children: t }),
      /* @__PURE__ */ e("strong", { className: "text-base font-bold text-neutral-900", children: n }),
      /* @__PURE__ */ e("p", { className: "text-sm leading-relaxed text-neutral-500", children: s }),
      r ? /* @__PURE__ */ e(
        "a",
        {
          href: i,
          className: "mt-2 inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-primary-600 px-5 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500",
          children: r
        }
      ) : /* @__PURE__ */ e(
        "a",
        {
          href: i,
          className: "mt-2 inline-flex w-fit items-center text-sm font-semibold text-primary-600 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          children: i
        }
      )
    ]
  }
);
export {
  x as JContactMethodCardView
};
//# sourceMappingURL=JContactMethodCardView.js.map
