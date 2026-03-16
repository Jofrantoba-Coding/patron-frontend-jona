import { jsxs as r, jsx as s } from "react/jsx-runtime";
import { cn as t } from "../lib/cn.js";
const o = {
  default: "bg-primary-600",
  success: "bg-success-500",
  danger: "bg-danger-500",
  warning: "bg-yellow-400"
}, f = ({ value: n = 0, variant: i = "default", showLabel: l = !1, label: a, className: d, ...u }) => {
  const e = Math.min(100, Math.max(0, n));
  return /* @__PURE__ */ r("div", { className: t("w-full", d), ...u, children: [
    (l || a) && /* @__PURE__ */ r("div", { className: "flex justify-between mb-1", children: [
      a && /* @__PURE__ */ s("span", { className: "text-xs font-medium text-neutral-700", children: a }),
      l && /* @__PURE__ */ r("span", { className: "text-xs text-neutral-500 ml-auto", children: [
        e,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ s("div", { role: "progressbar", "aria-valuenow": e, "aria-valuemin": 0, "aria-valuemax": 100, className: "h-2 w-full overflow-hidden rounded-full bg-neutral-200", children: /* @__PURE__ */ s("div", { className: t("h-full rounded-full transition-all duration-500 ease-out", o[i]), style: { width: `${e}%` } }) })
  ] });
};
export {
  f as ProgressAtom
};
//# sourceMappingURL=ProgressAtom.js.map
