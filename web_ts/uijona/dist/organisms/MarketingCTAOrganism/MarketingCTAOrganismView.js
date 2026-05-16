import { jsxs as s, jsx as n } from "react/jsx-runtime";
import { cn as p } from "../../lib/cn.js";
import { PanelAtomImpl as a } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { TextAtomImpl as r } from "../../atoms/TextAtom/TextAtomImpl.js";
import { LinkAtomImpl as m } from "../../atoms/LinkAtom/LinkAtomImpl.js";
const x = ({
  heading: c,
  description: e,
  primaryLabel: l,
  primaryHref: i,
  onPrimaryClick: d,
  secondaryLabel: o,
  secondaryHref: t,
  onSecondaryClick: g,
  className: h
}) => /* @__PURE__ */ s(a, { variant: "ghost", padding: "none", radius: "none", className: p("sales-cta-shell", h), children: [
  /* @__PURE__ */ s(a, { variant: "ghost", padding: "none", radius: "none", children: [
    /* @__PURE__ */ n(r, { as: "h2", className: "sales-title", children: c }),
    e && /* @__PURE__ */ n(r, { className: "sales-copy", children: e })
  ] }),
  /* @__PURE__ */ s(a, { variant: "ghost", padding: "none", radius: "none", className: "sales-actions", children: [
    i ? /* @__PURE__ */ n(m, { href: i, variant: "button", className: "sales-link", children: l }) : /* @__PURE__ */ n("button", { type: "button", onClick: d, className: "sales-link", children: l }),
    o && t && /* @__PURE__ */ n(m, { href: t, className: "sales-link-secondary", children: o })
  ] })
] });
export {
  x as MarketingCTAOrganismView
};
//# sourceMappingURL=MarketingCTAOrganismView.js.map
