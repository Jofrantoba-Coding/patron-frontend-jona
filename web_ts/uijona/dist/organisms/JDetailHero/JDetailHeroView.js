import { jsx as a, jsxs as r, Fragment as N } from "react/jsx-runtime";
import { cn as f } from "../../lib/cn.js";
import { JPanelImpl as i } from "../../atoms/JPanel/JPanelImpl.js";
import { JLabelImpl as n } from "../../atoms/JLabel/JLabelImpl.js";
const J = ({
  backHref: s,
  backLabel: d,
  eyebrow: e,
  title: o,
  outcome: c,
  primaryHref: h,
  primaryLabel: m,
  secondaryHref: t,
  secondaryLabel: l,
  visual: p,
  className: g
}) => /* @__PURE__ */ a(
  i,
  {
    as: "section",
    variant: "ghost",
    padding: "none",
    radius: "none",
    className: f("detail-hero", g),
    children: /* @__PURE__ */ r(i, { variant: "ghost", padding: "none", radius: "none", className: "detail-hero-inner", children: [
      /* @__PURE__ */ a(n, { variant: "link", href: s, className: "detail-back", children: d }),
      /* @__PURE__ */ r(i, { variant: "ghost", padding: "none", radius: "none", className: "detail-hero-copy", children: [
        e && (typeof e == "string" ? /* @__PURE__ */ a(n, { as: "span", className: "eyebrow", children: e }) : /* @__PURE__ */ a(N, { children: e })),
        /* @__PURE__ */ a(n, { as: "h1", className: "detail-title", children: o }),
        /* @__PURE__ */ a(n, { className: "detail-outcome", children: c }),
        /* @__PURE__ */ r(i, { variant: "ghost", padding: "none", radius: "none", className: "detail-hero-actions", children: [
          /* @__PURE__ */ a(n, { variant: "link-button", href: h, className: "detail-cta-primary", children: m }),
          t && l && /* @__PURE__ */ a(n, { variant: "link", href: t, className: "detail-cta-secondary", children: l })
        ] })
      ] }),
      p
    ] })
  }
);
export {
  J as JDetailHeroView
};
//# sourceMappingURL=JDetailHeroView.js.map
