import { jsxs as i, jsx as e } from "react/jsx-runtime";
import { cn as c } from "../../lib/cn.js";
import { JPanelImpl as s } from "../../atoms/JPanel/JPanelImpl.js";
import { TextAtomImpl as t } from "../../atoms/TextAtom/TextAtomImpl.js";
const d = {
  default: "bg-neutral-900 text-white",
  success: "bg-success-600 text-white",
  warning: "bg-warning-500 text-white",
  danger: "bg-danger-500 text-white"
}, x = ({
  message: a,
  title: n,
  variant: o = "default",
  className: r,
  onDismissClick: l
}) => /* @__PURE__ */ i(
  s,
  {
    variant: "ghost",
    padding: "none",
    radius: "none",
    role: "status",
    "aria-live": "polite",
    className: c(
      "flex w-full min-w-0 max-w-sm items-start gap-3 rounded-md px-4 py-3 shadow-lg sm:min-w-[240px]",
      d[o],
      r
    ),
    children: [
      /* @__PURE__ */ i(s, { variant: "ghost", padding: "none", radius: "none", className: "flex-1 min-w-0", children: [
        n && /* @__PURE__ */ e(t, { as: "span", className: "block text-sm font-semibold leading-none mb-1 break-words", children: n }),
        /* @__PURE__ */ e(t, { as: "span", className: "block text-sm leading-snug break-words", children: a })
      ] }),
      /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          "aria-label": "Dismiss notification",
          onClick: l,
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
  x as ToastMoleculeView
};
//# sourceMappingURL=ToastMoleculeView.js.map
