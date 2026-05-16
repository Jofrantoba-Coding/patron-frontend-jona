import { jsx as a, jsxs as n } from "react/jsx-runtime";
import { cn as p } from "../../lib/cn.js";
import { PanelAtomImpl as i } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { TextAtomImpl as s } from "../../atoms/TextAtom/TextAtomImpl.js";
import { LinkAtomImpl as o } from "../../atoms/LinkAtom/LinkAtomImpl.js";
const x = ({
  title: l,
  body: r,
  primaryHref: d,
  primaryLabel: c,
  secondaryHref: t,
  secondaryLabel: e,
  as: m = "section",
  className: h
}) => /* @__PURE__ */ a(
  i,
  {
    as: m,
    variant: "ghost",
    padding: "none",
    radius: "none",
    className: p("detail-section detail-cta-section", h),
    children: /* @__PURE__ */ a(i, { variant: "ghost", padding: "none", radius: "none", className: "detail-shell", children: /* @__PURE__ */ n(i, { variant: "ghost", padding: "none", radius: "none", className: "detail-cta-box", children: [
      /* @__PURE__ */ a(s, { as: "h2", className: "detail-cta-title", children: l }),
      /* @__PURE__ */ a(s, { className: "detail-cta-body", children: r }),
      /* @__PURE__ */ n(i, { variant: "ghost", padding: "none", radius: "none", className: "detail-cta-actions", children: [
        /* @__PURE__ */ a(o, { href: d, variant: "button", className: "detail-cta-primary", children: c }),
        t && e && /* @__PURE__ */ a(o, { href: t, className: "detail-cta-secondary", children: e })
      ] })
    ] }) })
  }
);
export {
  x as DetailCTAOrganismView
};
//# sourceMappingURL=DetailCTAOrganismView.js.map
