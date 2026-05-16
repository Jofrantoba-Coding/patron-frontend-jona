import { jsx as a } from "react/jsx-runtime";
import { cn as e } from "../../lib/cn.js";
import { PanelAtomImpl as n } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { ContactMethodCardMoleculeImpl as c } from "../../molecules/ContactMethodCardMolecule/ContactMethodCardMoleculeImpl.js";
import { GridLayoutImpl as s } from "../../layouts/GridLayout/GridLayoutImpl.js";
const g = ({
  methods: o,
  as: r = "section",
  className: t
}) => /* @__PURE__ */ a(
  n,
  {
    as: r,
    variant: "ghost",
    padding: "none",
    radius: "none",
    className: e("contact-methods-section", t),
    children: /* @__PURE__ */ a(n, { variant: "ghost", padding: "none", radius: "none", className: "section-shell", children: /* @__PURE__ */ a(s, { autoFitMin: "260px", className: "contact-methods-grid", children: o.map((i) => /* @__PURE__ */ a(
      c,
      {
        icon: i.icon,
        label: i.label,
        description: i.description,
        href: i.href,
        actionLabel: i.actionLabel,
        isPrimary: i.isPrimary
      },
      i.label
    )) }) })
  }
);
export {
  g as ContactMethodsOrganismView
};
//# sourceMappingURL=ContactMethodsOrganismView.js.map
