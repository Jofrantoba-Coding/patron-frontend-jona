import { jsxs as f, jsx as n } from "react/jsx-runtime";
import { cn as s } from "../../lib/cn.js";
import { JPanelImpl as a } from "../../atoms/JPanel/JPanelImpl.js";
const x = ({
  north: e,
  south: r,
  east: o,
  west: i,
  center: d,
  northClassName: t,
  southClassName: l,
  eastClassName: c,
  westClassName: m,
  centerClassName: g,
  className: h,
  style: p,
  forwardedRef: u
}) => /* @__PURE__ */ f(
  a,
  {
    ref: u,
    layout: "border",
    variant: "ghost",
    padding: "none",
    radius: "none",
    style: p,
    className: s("bg-neutral-50", h),
    children: [
      e && /* @__PURE__ */ n(a, { as: "header", area: "top", variant: "ghost", padding: "none", radius: "none", className: t, children: e }),
      i && /* @__PURE__ */ n(a, { as: "aside", area: "left", variant: "ghost", padding: "none", radius: "none", className: m, children: i }),
      /* @__PURE__ */ n(a, { as: "main", area: "center", variant: "ghost", padding: "none", radius: "none", className: s("overflow-auto", g), children: d }),
      o && /* @__PURE__ */ n(a, { as: "aside", area: "right", variant: "ghost", padding: "none", radius: "none", className: c, children: o }),
      r && /* @__PURE__ */ n(a, { as: "footer", area: "bottom", variant: "ghost", padding: "none", radius: "none", className: l, children: r })
    ]
  }
);
export {
  x as JBorderLayoutView
};
//# sourceMappingURL=JBorderLayoutView.js.map
