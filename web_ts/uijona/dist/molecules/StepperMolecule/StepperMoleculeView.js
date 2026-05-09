import { jsx as e, jsxs as c, Fragment as h } from "react/jsx-runtime";
import { cn as n } from "../../lib/cn.js";
const x = (l, i) => l < i ? "complete" : l === i ? "current" : "upcoming", w = () => /* @__PURE__ */ e("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: /* @__PURE__ */ e("path", { d: "m20 6-11 11-5-5" }) }), N = ({
  steps: l,
  activeStep: i,
  orientation: s = "horizontal",
  allowStepClick: m = !1,
  onStepClick: d,
  className: u,
  ...b
}) => /* @__PURE__ */ e(
  "ol",
  {
    className: n(
      s === "vertical" ? "flex min-w-0 flex-col gap-4" : "flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start",
      u
    ),
    ...b,
    children: l.map((r, a) => {
      const t = x(a, i), f = m && !r.disabled, p = n(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
        t === "complete" && "border-primary-600 bg-primary-600 text-white",
        t === "current" && "border-primary-600 bg-white text-primary-700",
        t === "upcoming" && "border-neutral-300 bg-white text-neutral-500",
        r.disabled && "opacity-50"
      ), o = /* @__PURE__ */ c(h, { children: [
        /* @__PURE__ */ e("span", { className: p, children: t === "complete" ? /* @__PURE__ */ e(w, {}) : a + 1 }),
        /* @__PURE__ */ c("span", { className: "min-w-0", children: [
          /* @__PURE__ */ e("span", { className: n("block break-words text-sm font-medium", t === "current" ? "text-neutral-900" : "text-neutral-700"), children: r.label }),
          r.description && /* @__PURE__ */ e("span", { className: "mt-0.5 block break-words text-sm text-neutral-500", children: r.description })
        ] })
      ] });
      return /* @__PURE__ */ e(
        "li",
        {
          className: n(
            "relative flex min-w-0 gap-3",
            s === "horizontal" && "sm:flex-1",
            r.disabled && "opacity-60"
          ),
          "aria-current": t === "current" ? "step" : void 0,
          children: f ? /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              disabled: r.disabled,
              onClick: () => d(a),
              className: "flex min-w-0 gap-3 rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
              children: o
            }
          ) : /* @__PURE__ */ e("div", { className: "flex min-w-0 gap-3", children: o })
        },
        r.id
      );
    })
  }
);
export {
  N as StepperMoleculeView
};
//# sourceMappingURL=StepperMoleculeView.js.map
