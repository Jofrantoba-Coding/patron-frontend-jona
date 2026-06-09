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
      "flex w-full min-w-0 max-w-sm items-start gap-3 rounded-md px-4 py-3 shadow-lg sm:min-w-[240px]",
      l[n],
      a
    ),
    children: [
      /* @__PURE__ */ i("div", { className: "min-w-0 flex-1", children: [
        s && /* @__PURE__ */ e("span", { className: "mb-1 block break-words text-sm font-semibold leading-none", children: s }),
        /* @__PURE__ */ e("span", { className: "block break-words text-sm leading-snug", children: t })
      ] }),
      /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          "aria-label": "Dismiss notification",
          onClick: o,
          className: "shrink-0 cursor-pointer rounded opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
          children: /* @__PURE__ */ i("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
            /* @__PURE__ */ e("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
            /* @__PURE__ */ e("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
          ] })
        }
      )
    ]
  }
);
export {
  m as JToastView
};
//# sourceMappingURL=JToastView.js.map
