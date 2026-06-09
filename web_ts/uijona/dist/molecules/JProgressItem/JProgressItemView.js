import { jsxs as n, jsx as m } from "react/jsx-runtime";
import { cn as r } from "../../lib/cn.js";
import { JPanelImpl as o } from "../../atoms/JPanel/JPanelImpl.js";
import { JProgressImpl as u } from "../../atoms/JProgress/JProgressImpl.js";
const d = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base"
}, x = {
  sm: "p-3",
  md: "p-4",
  lg: "p-5"
}, f = {
  default: "text-primary-600",
  success: "text-success-600",
  warning: "text-warning-500",
  danger: "text-danger-500"
}, N = ({
  label: l,
  value: s,
  max: e = 100,
  variant: a = "default",
  size: t = "md",
  showValue: c = !0,
  className: i,
  style: g
}) => {
  const p = Math.min(100, Math.max(0, e > 0 ? Math.round(s / e * 100) : 0));
  return /* @__PURE__ */ n(
    o,
    {
      variant: "ghost",
      padding: "none",
      className: r(
        "w-full rounded-lg border border-neutral-200 bg-white",
        x[t],
        i
      ),
      style: g,
      children: [
        /* @__PURE__ */ n(o, { variant: "ghost", padding: "none", className: "mb-2 flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ m("span", { className: r("font-medium text-neutral-800 leading-snug", d[t]), children: l }),
          c && /* @__PURE__ */ n("span", { className: r("shrink-0 tabular-nums font-semibold", d[t], f[a]), children: [
            p,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ m(u, { value: s, max: e, variant: a, size: t })
      ]
    }
  );
};
export {
  N as JProgressItemView
};
//# sourceMappingURL=JProgressItemView.js.map
