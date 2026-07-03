import { jsxs as a, jsx as e } from "react/jsx-runtime";
import { cn as n } from "../../lib/cn.js";
const d = ({
  question: r,
  answer: t,
  className: l
}) => /* @__PURE__ */ a(
  "div",
  {
    className: n(
      "rounded-xl border border-neutral-200 bg-neutral-50 p-6",
      l
    ),
    children: [
      /* @__PURE__ */ e("strong", { className: "mb-2 block text-base font-bold text-neutral-900", children: r }),
      /* @__PURE__ */ e("p", { className: "text-sm leading-relaxed text-neutral-600", children: t })
    ]
  }
);
export {
  d as JFaqItemView
};
//# sourceMappingURL=JFaqItemView.js.map
