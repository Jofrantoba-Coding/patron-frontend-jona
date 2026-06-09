import { jsx as r, jsxs as b } from "react/jsx-runtime";
import { cn as o } from "../../lib/cn.js";
import { JPROGRESS_DEFAULTS as a } from "./InterJProgress.js";
const w = {
  sm: "h-1",
  md: "h-2",
  lg: "h-4"
}, k = {
  default: "bg-primary-600",
  success: "bg-success-600",
  warning: "bg-warning-500",
  danger: "bg-danger-500"
}, N = {
  sm: 48,
  md: 72,
  lg: 104
}, S = {
  sm: 4,
  md: 6,
  lg: 8
}, $ = {
  default: "#2563eb",
  success: "#16a34a",
  warning: "#f59e0b",
  danger: "#ef4444"
}, D = {
  sm: 10,
  md: 13,
  lg: 18
}, M = ({
  value: l = a.value,
  max: t = a.max,
  variant: i = a.variant,
  type: x = a.type,
  size: s = a.size,
  showLabel: h = a.showLabel,
  animated: v = a.animated,
  label: y,
  className: f,
  style: u,
  forwardedRef: p
}) => {
  const c = Math.min(100, Math.max(0, t > 0 ? l / t * 100 : 0)), n = y ?? `${Math.round(c)}%`;
  if (x === "circle") {
    const e = N[s], d = S[s], m = (e - d) / 2, g = 2 * Math.PI * m, j = g - c / 100 * g;
    return /* @__PURE__ */ r(
      "div",
      {
        ref: p,
        "data-jprogress-type": "circle",
        "data-jprogress-variant": i,
        "data-jprogress-size": s,
        className: o("jprogress inline-flex items-center justify-center", f),
        style: u,
        children: /* @__PURE__ */ b(
          "svg",
          {
            width: e,
            height: e,
            viewBox: `0 0 ${e} ${e}`,
            role: "progressbar",
            "aria-valuenow": l,
            "aria-valuemin": 0,
            "aria-valuemax": t,
            "aria-label": n,
            children: [
              /* @__PURE__ */ r(
                "circle",
                {
                  cx: e / 2,
                  cy: e / 2,
                  r: m,
                  fill: "none",
                  stroke: "#e5e7eb",
                  strokeWidth: d
                }
              ),
              /* @__PURE__ */ r(
                "circle",
                {
                  cx: e / 2,
                  cy: e / 2,
                  r: m,
                  fill: "none",
                  stroke: $[i],
                  strokeWidth: d,
                  strokeLinecap: "round",
                  strokeDasharray: g,
                  strokeDashoffset: j,
                  style: { transition: "stroke-dashoffset 0.35s ease", transformOrigin: "center" },
                  transform: `rotate(-90 ${e / 2} ${e / 2})`
                }
              ),
              h && /* @__PURE__ */ r(
                "text",
                {
                  x: "50%",
                  y: "50%",
                  dominantBaseline: "central",
                  textAnchor: "middle",
                  fill: "#6b7280",
                  fontWeight: 600,
                  style: { fontSize: D[s], fontVariantNumeric: "tabular-nums" },
                  children: n
                }
              )
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ b(
    "div",
    {
      ref: p,
      "data-jprogress-type": "bar",
      "data-jprogress-variant": i,
      "data-jprogress-size": s,
      className: o("jprogress flex items-center gap-2", f),
      style: u,
      children: [
        /* @__PURE__ */ r(
          "div",
          {
            role: "progressbar",
            "aria-valuenow": l,
            "aria-valuemin": 0,
            "aria-valuemax": t,
            "aria-label": n,
            className: o(
              "relative flex-1 rounded-full bg-neutral-200 overflow-hidden",
              w[s]
            ),
            children: /* @__PURE__ */ r(
              "div",
              {
                className: o(
                  "h-full rounded-full transition-all duration-300",
                  k[i],
                  v && "jprogress-bar-shimmer"
                ),
                style: { width: `${c}%` }
              }
            )
          }
        ),
        h && /* @__PURE__ */ r("span", { className: "text-xs text-neutral-500 tabular-nums w-9 text-right shrink-0", children: n })
      ]
    }
  );
};
M.displayName = "JProgressView";
export {
  M as JProgressView
};
//# sourceMappingURL=JProgressView.js.map
