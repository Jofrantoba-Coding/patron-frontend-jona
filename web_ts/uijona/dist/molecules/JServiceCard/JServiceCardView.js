import { jsxs as d, jsx as a } from "react/jsx-runtime";
import { cn as t } from "../../lib/cn.js";
import { JPanelImpl as r } from "../../atoms/JPanel/JPanelImpl.js";
import { JLabelImpl as e } from "../../atoms/JLabel/JLabelImpl.js";
const N = ({
  icon: n,
  title: c,
  description: o,
  proof: i,
  href: s,
  className: l
}) => /* @__PURE__ */ d(r, { variant: "ghost", padding: "none", radius: "none", className: t("service-card business-card", l), children: [
  /* @__PURE__ */ d(r, { className: "card-area-header", variant: "ghost", padding: "none", radius: "none", children: [
    n && /* @__PURE__ */ a(e, { as: "span", className: "service-icon-emoji", "aria-hidden": "true", children: n }),
    /* @__PURE__ */ a(e, { as: "h3", className: "card-title", children: c }),
    /* @__PURE__ */ a(e, { className: "card-description", children: o })
  ] }),
  i && /* @__PURE__ */ a(r, { className: "card-area-content", variant: "ghost", padding: "none", radius: "none", children: /* @__PURE__ */ a(e, { className: "business-proof", children: i }) }),
  s && /* @__PURE__ */ a(r, { className: "card-area-footer", variant: "ghost", padding: "none", radius: "none", children: /* @__PURE__ */ a(e, { variant: "link", href: s, className: "card-detail-link", children: "Ver servicio →" }) })
] });
export {
  N as JServiceCardView
};
//# sourceMappingURL=JServiceCardView.js.map
