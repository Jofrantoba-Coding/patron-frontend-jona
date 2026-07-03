import { jsxs as n, jsx as e } from "react/jsx-runtime";
import { cn as a } from "../../lib/cn.js";
const o = ({
  value: t,
  label: r,
  className: l
}) => /* @__PURE__ */ n(
  "div",
  {
    className: a(
      "flex min-w-0 flex-col gap-1.5 rounded-xl border border-neutral-200 bg-white p-5",
      l
    ),
    children: [
      /* @__PURE__ */ e("strong", { className: "text-2xl font-black leading-none text-neutral-900 sm:text-3xl", children: t }),
      /* @__PURE__ */ e("span", { className: "text-sm leading-relaxed text-neutral-500", children: r })
    ]
  }
);
export {
  o as JMetricCardView
};
//# sourceMappingURL=JMetricCardView.js.map
