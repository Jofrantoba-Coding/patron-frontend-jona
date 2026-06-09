import { jsxs as l, jsx as e } from "react/jsx-runtime";
import { cn as i } from "../../lib/cn.js";
import { JPanelImpl as d } from "../../atoms/JPanel/JPanelImpl.js";
const x = {
  default: "bg-neutral-50  border-neutral-200 text-neutral-900",
  info: "bg-primary-50  border-primary-300  text-primary-800",
  success: "bg-green-50    border-green-300    text-green-800",
  warning: "bg-yellow-50   border-yellow-300   text-yellow-800",
  danger: "bg-red-50      border-danger-500   text-danger-700"
}, c = {
  default: "text-neutral-400 hover:text-neutral-700",
  info: "text-primary-400 hover:text-primary-700",
  success: "text-green-400   hover:text-green-700",
  warning: "text-yellow-500  hover:text-yellow-800",
  danger: "text-danger-400  hover:text-danger-700"
}, p = ({
  variant: t = "default",
  title: n,
  icon: r,
  dismissible: a = !1,
  onDismiss: s,
  className: g,
  children: o,
  ...u
}) => /* @__PURE__ */ l(
  d,
  {
    variant: "ghost",
    padding: "none",
    role: "alert",
    className: i(
      "relative w-full min-w-0 rounded-md border p-4",
      r && "pl-11",
      a && "pr-10",
      x[t],
      g
    ),
    ...u,
    children: [
      r && /* @__PURE__ */ e("span", { className: "absolute left-4 top-4 text-current", "aria-hidden": "true", children: r }),
      a && /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          "aria-label": "Cerrar alerta",
          onClick: s,
          className: i(
            "absolute right-3 top-3 rounded p-0.5 transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current",
            c[t]
          ),
          children: /* @__PURE__ */ l("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, "aria-hidden": "true", children: [
            /* @__PURE__ */ e("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
            /* @__PURE__ */ e("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
          ] })
        }
      ),
      n && /* @__PURE__ */ e("h5", { className: "mb-1 break-words font-medium leading-tight tracking-tight", children: n }),
      o && /* @__PURE__ */ e(d, { variant: "ghost", padding: "none", className: "break-words text-sm [&_p]:leading-relaxed", children: o })
    ]
  }
);
export {
  p as JAlertView
};
//# sourceMappingURL=JAlertView.js.map
