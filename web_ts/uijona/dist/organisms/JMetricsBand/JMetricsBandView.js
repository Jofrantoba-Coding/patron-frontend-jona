import { jsx as e, jsxs as s } from "react/jsx-runtime";
import { cn as i } from "../../lib/cn.js";
const m = ({
  metrics: a,
  as: r = "section",
  id: t,
  className: n
}) => /* @__PURE__ */ e(r, { id: t, className: i("w-full border-t border-neutral-800 bg-neutral-900 py-12", n), children: /* @__PURE__ */ e("div", { className: "mx-auto w-full max-w-6xl px-4 sm:px-6", children: /* @__PURE__ */ e("div", { className: "grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]", children: a.map((l) => /* @__PURE__ */ s(
  "div",
  {
    className: "flex flex-col gap-1.5 rounded-xl border border-white/10 bg-white/5 px-6 py-5",
    children: [
      /* @__PURE__ */ e("strong", { className: "text-2xl font-black leading-none text-primary-400 sm:text-3xl", children: l.value }),
      /* @__PURE__ */ e("span", { className: "text-sm leading-relaxed text-neutral-400", children: l.label })
    ]
  },
  l.label
)) }) }) });
export {
  m as JMetricsBandView
};
//# sourceMappingURL=JMetricsBandView.js.map
