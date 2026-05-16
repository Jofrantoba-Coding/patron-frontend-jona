import { jsx as a, jsxs as n, Fragment as f } from "react/jsx-runtime";
import { cn as u } from "../../lib/cn.js";
import { PanelAtomImpl as i } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { LinkAtomImpl as t } from "../../atoms/LinkAtom/LinkAtomImpl.js";
import { TextAtomImpl as r } from "../../atoms/TextAtom/TextAtomImpl.js";
const k = ({
  backHref: l,
  backLabel: d,
  eyebrow: e,
  title: m,
  outcome: c,
  primaryHref: h,
  primaryLabel: p,
  secondaryHref: s,
  secondaryLabel: o,
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
      /* @__PURE__ */ a(t, { href: l, className: "detail-back", children: d }),
      /* @__PURE__ */ n(i, { variant: "ghost", padding: "none", radius: "none", className: "detail-hero-copy", children: [
        e && (typeof e == "string" ? /* @__PURE__ */ a(r, { as: "span", className: "eyebrow", children: e }) : /* @__PURE__ */ a(f, { children: e })),
        /* @__PURE__ */ a(r, { as: "h1", className: "detail-title", children: m }),
        /* @__PURE__ */ a(r, { className: "detail-outcome", children: c }),
        /* @__PURE__ */ n(i, { variant: "ghost", padding: "none", radius: "none", className: "detail-hero-actions", children: [
          /* @__PURE__ */ a(t, { href: h, variant: "button", className: "detail-cta-primary", children: p }),
          s && o && /* @__PURE__ */ a(t, { href: s, className: "detail-cta-secondary", children: o })
        ] })
      ] }),
      g
    ] })
  }
);
export {
  k as DetailHeroOrganismView
};
//# sourceMappingURL=DetailHeroOrganismView.js.map
