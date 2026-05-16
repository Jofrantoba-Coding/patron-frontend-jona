import { jsxs as i, jsx as r } from "react/jsx-runtime";
import { cn as m } from "../../lib/cn.js";
import { PanelAtomImpl as e } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { TextAtomImpl as s } from "../../atoms/TextAtom/TextAtomImpl.js";
import { LinkAtomImpl as l } from "../../atoms/LinkAtom/LinkAtomImpl.js";
const g = ({
  copyright: t,
  links: n,
  className: a
}) => /* @__PURE__ */ i(
  e,
  {
    as: "footer",
    variant: "ghost",
    padding: "none",
    radius: "none",
    className: m("site-footer", a),
    children: [
      /* @__PURE__ */ r(s, { as: "span", children: t }),
      /* @__PURE__ */ r(e, { variant: "ghost", padding: "none", radius: "none", className: "site-footer-links", children: n.map((o) => /* @__PURE__ */ r(l, { href: o.href, className: "footer-link", children: o.label }, o.href)) })
    ]
  }
);
export {
  g as SiteFooterOrganismView
};
//# sourceMappingURL=SiteFooterOrganismView.js.map
