import { jsxs as i, jsx as r } from "react/jsx-runtime";
import { cn as s } from "../../lib/cn.js";
import { JPanelImpl as e } from "../../atoms/JPanel/JPanelImpl.js";
import { TextAtomImpl as m } from "../../atoms/TextAtom/TextAtomImpl.js";
import { LinkAtomImpl as l } from "../../atoms/LinkAtom/LinkAtomImpl.js";
const g = ({
  copyright: n,
  links: t,
  className: a
}) => /* @__PURE__ */ i(
  e,
  {
    as: "footer",
    variant: "ghost",
    padding: "none",
    radius: "none",
    className: s("site-footer", a),
    children: [
      /* @__PURE__ */ r(m, { as: "span", children: n }),
      /* @__PURE__ */ r(e, { variant: "ghost", padding: "none", radius: "none", className: "site-footer-links", children: t.map((o) => /* @__PURE__ */ r(l, { href: o.href, className: "footer-link", children: o.label }, o.href)) })
    ]
  }
);
export {
  g as SiteFooterOrganismView
};
//# sourceMappingURL=SiteFooterOrganismView.js.map
