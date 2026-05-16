import { jsxs as c, jsx as a } from "react/jsx-runtime";
import { cn as t } from "../../lib/cn.js";
import { PanelAtomImpl as e } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { TextAtomImpl as r } from "../../atoms/TextAtom/TextAtomImpl.js";
import { LinkAtomImpl as m } from "../../atoms/LinkAtom/LinkAtomImpl.js";
const v = ({
  icon: n,
  title: d,
  description: o,
  proof: i,
  href: s,
  className: l
}) => /* @__PURE__ */ c(e, { variant: "ghost", padding: "none", radius: "none", className: t("service-card business-card", l), children: [
  /* @__PURE__ */ c(e, { className: "card-area-header", variant: "ghost", padding: "none", radius: "none", children: [
    n && /* @__PURE__ */ a(r, { as: "span", className: "service-icon-emoji", "aria-hidden": "true", children: n }),
    /* @__PURE__ */ a(r, { as: "h3", className: "card-title", children: d }),
    /* @__PURE__ */ a(r, { className: "card-description", children: o })
  ] }),
  i && /* @__PURE__ */ a(e, { className: "card-area-content", variant: "ghost", padding: "none", radius: "none", children: /* @__PURE__ */ a(r, { className: "business-proof", children: i }) }),
  s && /* @__PURE__ */ a(e, { className: "card-area-footer", variant: "ghost", padding: "none", radius: "none", children: /* @__PURE__ */ a(m, { href: s, className: "card-detail-link", children: "Ver servicio →" }) })
] });
export {
  v as ServiceCardMoleculeView
};
//# sourceMappingURL=ServiceCardMoleculeView.js.map
