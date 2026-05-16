import { jsxs as i, jsx as t } from "react/jsx-runtime";
import { cn as l } from "../../lib/cn.js";
import { PanelAtomImpl as h } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { TextAtomImpl as a } from "../../atoms/TextAtom/TextAtomImpl.js";
import { LinkAtomImpl as m } from "../../atoms/LinkAtom/LinkAtomImpl.js";
const g = ({
  icon: n,
  label: e,
  description: r,
  href: o,
  actionLabel: c,
  isPrimary: s,
  className: d
}) => /* @__PURE__ */ i(
  h,
  {
    variant: "ghost",
    padding: "none",
    radius: "none",
    className: l("contact-method-card", s && "primary", d),
    children: [
      /* @__PURE__ */ t(a, { as: "span", className: "contact-method-icon", "aria-hidden": "true", children: n }),
      /* @__PURE__ */ t(a, { as: "strong", className: "contact-method-label", children: e }),
      /* @__PURE__ */ t(a, { className: "contact-method-desc", children: r }),
      c ? /* @__PURE__ */ t(m, { href: o, variant: "button", className: "contact-method-cta", children: c }) : /* @__PURE__ */ t(m, { href: o, className: "contact-method-link", children: o })
    ]
  }
);
export {
  g as ContactMethodCardMoleculeView
};
//# sourceMappingURL=ContactMethodCardMoleculeView.js.map
