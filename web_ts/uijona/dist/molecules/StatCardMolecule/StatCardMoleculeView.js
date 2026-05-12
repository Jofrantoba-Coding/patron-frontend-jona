import { jsxs as t, jsx as e } from "react/jsx-runtime";
import { cn as r } from "../../lib/cn.js";
import { PanelAtomImpl as n } from "../../atoms/PanelAtom/PanelAtomImpl.js";
const u = {
  neutral: "bg-neutral-100 text-neutral-600",
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  danger: "bg-danger-50 text-danger-700",
  info: "bg-primary-50 text-primary-700"
}, x = {
  up: "text-success-700",
  down: "text-danger-700",
  flat: "text-neutral-500"
}, f = ({
  label: d,
  value: l,
  description: a,
  icon: i,
  tone: o = "neutral",
  trend: m = "flat",
  trendLabel: s,
  className: c,
  ...g
}) => /* @__PURE__ */ t(n, { variant: "ghost", padding: "none", radius: "none", className: r("min-w-0 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-5", c), ...g, children: [
  /* @__PURE__ */ t(n, { variant: "ghost", padding: "none", radius: "none", className: "flex min-w-0 items-start justify-between gap-3", children: [
    /* @__PURE__ */ t(n, { variant: "ghost", padding: "none", radius: "none", className: "min-w-0", children: [
      /* @__PURE__ */ e("p", { className: "break-words text-sm font-medium text-neutral-500", children: d }),
      /* @__PURE__ */ e("p", { className: "mt-1 break-words text-2xl font-semibold leading-tight text-neutral-900", children: l })
    ] }),
    i && /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: r("flex h-10 w-10 shrink-0 items-center justify-center rounded-md", u[o]), children: i })
  ] }),
  (a || s) && /* @__PURE__ */ t(n, { variant: "ghost", padding: "none", radius: "none", className: "mt-3 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm", children: [
    s && /* @__PURE__ */ e("span", { className: r("font-medium", x[m]), children: s }),
    a && /* @__PURE__ */ e("span", { className: "break-words text-neutral-500", children: a })
  ] })
] });
export {
  f as StatCardMoleculeView
};
//# sourceMappingURL=StatCardMoleculeView.js.map
