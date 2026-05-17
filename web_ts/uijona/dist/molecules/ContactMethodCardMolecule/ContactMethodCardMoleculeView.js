import { jsxs as i, jsx as t } from "react/jsx-runtime";
import { cn as l } from "../../lib/cn.js";
import { JPanelImpl as h } from "../../atoms/JPanel/JPanelImpl.js";
import { TextAtomImpl as o } from "../../atoms/TextAtom/TextAtomImpl.js";
import { LinkAtomImpl as n } from "../../atoms/LinkAtom/LinkAtomImpl.js";
const g = ({
  icon: e,
  label: m,
  description: r,
  href: a,
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
      /* @__PURE__ */ t(o, { as: "span", className: "contact-method-icon", "aria-hidden": "true", children: e }),
      /* @__PURE__ */ t(o, { as: "strong", className: "contact-method-label", children: m }),
      /* @__PURE__ */ t(o, { className: "contact-method-desc", children: r }),
      c ? /* @__PURE__ */ t(n, { href: a, variant: "button", className: "contact-method-cta", children: c }) : /* @__PURE__ */ t(n, { href: a, className: "contact-method-link", children: a })
    ]
  }
);
export {
  g as ContactMethodCardMoleculeView
};
//# sourceMappingURL=ContactMethodCardMoleculeView.js.map
