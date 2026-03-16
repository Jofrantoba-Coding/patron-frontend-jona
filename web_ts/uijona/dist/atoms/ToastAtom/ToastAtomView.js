import { jsxs as i, jsx as e } from "react/jsx-runtime";
import { cn as r } from "../../lib/cn.js";
const l = {
  default: "bg-neutral-900 text-white",
  success: "bg-success-600 text-white",
  warning: "bg-warning-500 text-white",
  danger: "bg-danger-500 text-white"
}, m = ({
  message: t,
  title: s,
  variant: n = "default",
  className: a,
  onDismissClick: o
}) => /* @__PURE__ */ i(
  "div",
  {
    role: "status",
    "aria-live": "polite",
    className: r(
      "flex items-start gap-3 rounded-md px-4 py-3 shadow-lg min-w-[240px] max-w-sm",
      l[n],
      a
    ),
    children: [
      /* @__PURE__ */ i("div", { className: "flex-1 min-w-0", children: [
        s && /* @__PURE__ */ e("p", { className: "text-sm font-semibold leading-none mb-1", children: s }),
        /* @__PURE__ */ e("p", { className: "text-sm leading-snug", children: t })
      ] }),
      /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          "aria-label": "Dismiss notification",
          onClick: o,
          className: "shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded",
          children: /* @__PURE__ */ i("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
            /* @__PURE__ */ e("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
            /* @__PURE__ */ e("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
          ] })
        }
      )
    ]
  }
);
export {
  m as ToastAtomView
};
//# sourceMappingURL=ToastAtomView.js.map
