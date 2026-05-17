import { jsx as a, jsxs as n, Fragment as f } from "react/jsx-runtime";
import { cn as u } from "../../lib/cn.js";
import { JPanelImpl as i } from "../../atoms/JPanel/JPanelImpl.js";
import { LinkAtomImpl as r } from "../../atoms/LinkAtom/LinkAtomImpl.js";
import { TextAtomImpl as t } from "../../atoms/TextAtom/TextAtomImpl.js";
const A = ({
  backHref: o,
  backLabel: d,
  eyebrow: e,
  title: c,
  outcome: m,
  primaryHref: h,
  primaryLabel: p,
  secondaryHref: s,
  secondaryLabel: l,
  visual: g,
  className: N
}) => /* @__PURE__ */ a(
  i,
  {
    as: "section",
    variant: "ghost",
    padding: "none",
    radius: "none",
    className: u("detail-hero", N),
    children: /* @__PURE__ */ n(i, { variant: "ghost", padding: "none", radius: "none", className: "detail-hero-inner", children: [
      /* @__PURE__ */ a(r, { href: o, className: "detail-back", children: d }),
      /* @__PURE__ */ n(i, { variant: "ghost", padding: "none", radius: "none", className: "detail-hero-copy", children: [
        e && (typeof e == "string" ? /* @__PURE__ */ a(t, { as: "span", className: "eyebrow", children: e }) : /* @__PURE__ */ a(f, { children: e })),
        /* @__PURE__ */ a(t, { as: "h1", className: "detail-title", children: c }),
        /* @__PURE__ */ a(t, { className: "detail-outcome", children: m }),
        /* @__PURE__ */ n(i, { variant: "ghost", padding: "none", radius: "none", className: "detail-hero-actions", children: [
          /* @__PURE__ */ a(r, { href: h, variant: "button", className: "detail-cta-primary", children: p }),
          s && l && /* @__PURE__ */ a(r, { href: s, className: "detail-cta-secondary", children: l })
        ] })
      ] }),
      g
    ] })
  }
);
export {
  A as DetailHeroOrganismView
};
//# sourceMappingURL=DetailHeroOrganismView.js.map
