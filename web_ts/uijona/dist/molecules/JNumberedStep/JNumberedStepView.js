import { jsxs as r, jsx as e } from "react/jsx-runtime";
import { cn as i } from "../../lib/cn.js";
const m = ({
  num: t,
  title: a,
  body: l,
  className: s
}) => /* @__PURE__ */ r(
  "div",
  {
    className: i(
      "flex items-start gap-5 rounded-xl border border-neutral-200 bg-white p-6",
      s
    ),
    children: [
      /* @__PURE__ */ e("span", { className: "inline-grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-primary-200 bg-primary-50 text-sm font-black text-primary-700", children: t }),
      /* @__PURE__ */ r("div", { className: "flex min-w-0 flex-col gap-1.5", children: [
        /* @__PURE__ */ e("strong", { className: "text-base font-bold text-neutral-900", children: a }),
        /* @__PURE__ */ e("p", { className: "text-sm leading-relaxed text-neutral-500", children: l })
      ] })
    ]
  }
);
export {
  m as JNumberedStepView
};
//# sourceMappingURL=JNumberedStepView.js.map
