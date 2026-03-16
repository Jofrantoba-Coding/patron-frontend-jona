import { jsxs as t, jsx as s } from "react/jsx-runtime";
import { cn as l } from "../../lib/cn.js";
const d = {
  default: "bg-primary-600",
  success: "bg-success-600",
  warning: "bg-warning-500",
  danger: "bg-danger-500"
}, m = ({
  value: a = 0,
  max: r = 100,
  variant: n = "default",
  showLabel: i,
  className: o
}) => {
  const e = Math.min(100, Math.max(0, a / r * 100));
  return /* @__PURE__ */ t("div", { className: l("flex items-center gap-2", o), children: [
    /* @__PURE__ */ s(
      "div",
      {
        role: "progressbar",
        "aria-valuenow": a,
        "aria-valuemin": 0,
        "aria-valuemax": r,
        className: "relative flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden",
        children: /* @__PURE__ */ s(
          "div",
          {
            className: l("h-full rounded-full transition-all duration-300", d[n]),
            style: { width: `${e}%` }
          }
        )
      }
    ),
    i && /* @__PURE__ */ t("span", { className: "text-xs text-neutral-500 tabular-nums w-9 text-right", children: [
      Math.round(e),
      "%"
    ] })
  ] });
};
export {
  m as ProgressAtomView
};
//# sourceMappingURL=ProgressAtomView.js.map
