import { jsxs as t, jsx as s } from "react/jsx-runtime";
import { cn as o } from "../../lib/cn.js";
import { PanelAtomImpl as a } from "../PanelAtom/PanelAtomImpl.js";
const u = {
  default: "bg-primary-600",
  success: "bg-success-600",
  warning: "bg-warning-500",
  danger: "bg-danger-500"
}, h = ({
  value: n = 0,
  max: r = 100,
  variant: i = "default",
  showLabel: l,
  className: d
}) => {
  const e = Math.min(100, Math.max(0, n / r * 100));
  return /* @__PURE__ */ t(a, { variant: "ghost", padding: "none", radius: "none", className: o("flex items-center gap-2", d), children: [
    /* @__PURE__ */ s(
      a,
      {
        variant: "ghost",
        padding: "none",
        radius: "none",
        role: "progressbar",
        "aria-valuenow": n,
        "aria-valuemin": 0,
        "aria-valuemax": r,
        className: "relative flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden",
        children: /* @__PURE__ */ s(
          a,
          {
            variant: "ghost",
            padding: "none",
            radius: "none",
            className: o("h-full rounded-full transition-all duration-300", u[i]),
            style: { width: `${e}%` }
          }
        )
      }
    ),
    l && /* @__PURE__ */ t("span", { className: "text-xs text-neutral-500 tabular-nums w-9 text-right", children: [
      Math.round(e),
      "%"
    ] })
  ] });
};
export {
  h as ProgressAtomView
};
//# sourceMappingURL=ProgressAtomView.js.map
