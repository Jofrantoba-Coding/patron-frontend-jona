import { jsxs as n, jsx as r } from "react/jsx-runtime";
import { cn as t } from "../../lib/cn.js";
const d = {
  dark: "border-white/10 bg-white/5",
  light: "border-neutral-200 bg-white shadow-sm"
}, o = {
  dark: "text-white",
  light: "text-neutral-900"
}, c = {
  dark: "text-white/60",
  light: "text-neutral-500"
}, h = ({
  value: s,
  label: l,
  tone: e = "dark",
  className: a,
  ...i
}) => /* @__PURE__ */ n(
  "div",
  {
    className: t(
      "min-w-0 rounded-xl border px-5 py-4 text-center",
      d[e],
      a
    ),
    ...i,
    children: [
      /* @__PURE__ */ r("p", { className: t("text-3xl font-bold leading-none sm:text-4xl", o[e]), children: s }),
      /* @__PURE__ */ r("p", { className: t("mt-1.5 text-xs font-medium uppercase tracking-wide", c[e]), children: l })
    ]
  }
);
export {
  h as MetricCardMoleculeView
};
//# sourceMappingURL=MetricCardMoleculeView.js.map
