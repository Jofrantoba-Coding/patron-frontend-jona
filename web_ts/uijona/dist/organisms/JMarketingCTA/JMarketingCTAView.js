import { jsxs as s, jsx as n } from "react/jsx-runtime";
import { cn as m } from "../../lib/cn.js";
import { JPanelImpl as l } from "../../atoms/JPanel/JPanelImpl.js";
import { JLabelImpl as a } from "../../atoms/JLabel/JLabelImpl.js";
const v = ({
  heading: r,
  description: e,
  primaryLabel: i,
  primaryHref: o,
  onPrimaryClick: d,
  secondaryLabel: t,
  secondaryHref: c,
  onSecondaryClick: p,
  className: h
}) => /* @__PURE__ */ s(l, { variant: "ghost", padding: "none", radius: "none", className: m("sales-cta-shell", h), children: [
  /* @__PURE__ */ s(l, { variant: "ghost", padding: "none", radius: "none", children: [
    /* @__PURE__ */ n(a, { as: "h2", className: "sales-title", children: r }),
    e && /* @__PURE__ */ n(a, { className: "sales-copy", children: e })
  ] }),
  /* @__PURE__ */ s(l, { variant: "ghost", padding: "none", radius: "none", className: "sales-actions", children: [
    o ? /* @__PURE__ */ n(a, { variant: "link-button", href: o, className: "sales-link", children: i }) : /* @__PURE__ */ n("button", { type: "button", onClick: d, className: "sales-link", children: i }),
    t && c && /* @__PURE__ */ n(a, { variant: "link", href: c, className: "sales-link-secondary", children: t })
  ] })
] });
export {
  v as JMarketingCTAView
};
//# sourceMappingURL=JMarketingCTAView.js.map
