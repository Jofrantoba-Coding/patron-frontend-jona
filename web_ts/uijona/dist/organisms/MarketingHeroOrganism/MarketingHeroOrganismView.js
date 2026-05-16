import { jsx as r, jsxs as t } from "react/jsx-runtime";
import { cn as h } from "../../lib/cn.js";
import { PanelAtomImpl as e } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { TextAtomImpl as i } from "../../atoms/TextAtom/TextAtomImpl.js";
import { LinkAtomImpl as c } from "../../atoms/LinkAtom/LinkAtomImpl.js";
function g(n) {
  const o = n.variant === "outline" ? "hero-link-secondary" : "hero-link-primary";
  return n.href ? /* @__PURE__ */ r(c, { href: n.href, variant: n.variant === "primary" ? "button" : void 0, className: o, children: n.label }, n.label) : /* @__PURE__ */ r("button", { type: "button", onClick: n.onClick, className: h("hero-link-primary", o), children: n.label }, n.label);
}
const y = ({
  eyebrow: n,
  title: o,
  subtitle: s,
  ctas: a,
  visual: l,
  metrics: d,
  className: m,
  ...p
}) => /* @__PURE__ */ r(e, { as: "section", variant: "ghost", padding: "none", radius: "none", className: h("hero-section", m), ...p, children: /* @__PURE__ */ t(e, { className: "hero-grid", variant: "ghost", padding: "none", radius: "none", children: [
  /* @__PURE__ */ t(e, { className: "hero-copy", variant: "ghost", padding: "none", radius: "none", children: [
    n && /* @__PURE__ */ r(i, { as: "span", className: "eyebrow", children: n }),
    /* @__PURE__ */ r(i, { as: "h1", className: "hero-title", children: o }),
    s && /* @__PURE__ */ r(i, { className: "hero-summary", children: s }),
    a && a.length > 0 && /* @__PURE__ */ r(e, { className: "hero-actions", variant: "ghost", padding: "none", radius: "none", children: a.map(g) }),
    d && /* @__PURE__ */ r(e, { variant: "ghost", padding: "none", radius: "none", children: d })
  ] }),
  l && /* @__PURE__ */ r(e, { variant: "ghost", padding: "none", radius: "none", children: l })
] }) });
export {
  y as MarketingHeroOrganismView
};
//# sourceMappingURL=MarketingHeroOrganismView.js.map
