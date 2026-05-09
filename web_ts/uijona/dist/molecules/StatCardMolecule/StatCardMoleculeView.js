import { jsxs as t, jsx as e } from "react/jsx-runtime";
import { cn as r } from "../../lib/cn.js";
const o = {
  neutral: "bg-neutral-100 text-neutral-600",
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  danger: "bg-danger-50 text-danger-700",
  info: "bg-primary-50 text-primary-700"
}, u = {
  up: "text-success-700",
  down: "text-danger-700",
  flat: "text-neutral-500"
}, f = ({
  label: l,
  value: i,
  description: s,
  icon: n,
  tone: m = "neutral",
  trend: d = "flat",
  trendLabel: a,
  className: c,
  ...x
}) => /* @__PURE__ */ t("div", { className: r("min-w-0 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-5", c), ...x, children: [
  /* @__PURE__ */ t("div", { className: "flex min-w-0 items-start justify-between gap-3", children: [
    /* @__PURE__ */ t("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e("p", { className: "break-words text-sm font-medium text-neutral-500", children: l }),
      /* @__PURE__ */ e("p", { className: "mt-1 break-words text-2xl font-semibold leading-tight text-neutral-900", children: i })
    ] }),
    n && /* @__PURE__ */ e("div", { className: r("flex h-10 w-10 shrink-0 items-center justify-center rounded-md", o[m]), children: n })
  ] }),
  (s || a) && /* @__PURE__ */ t("div", { className: "mt-3 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm", children: [
    a && /* @__PURE__ */ e("span", { className: r("font-medium", u[d]), children: a }),
    s && /* @__PURE__ */ e("span", { className: "break-words text-neutral-500", children: s })
  ] })
] });
export {
  f as StatCardMoleculeView
};
//# sourceMappingURL=StatCardMoleculeView.js.map
