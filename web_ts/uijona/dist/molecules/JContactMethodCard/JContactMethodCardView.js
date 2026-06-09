import { jsxs as i, jsx as a } from "react/jsx-runtime";
import { cn as d } from "../../lib/cn.js";
import { JPanelImpl as l } from "../../atoms/JPanel/JPanelImpl.js";
import { JLabelImpl as t } from "../../atoms/JLabel/JLabelImpl.js";
const k = ({
  icon: o,
  label: e,
  description: r,
  href: n,
  actionLabel: c,
  isPrimary: m,
  className: s
}) => /* @__PURE__ */ i(
  l,
  {
    variant: "ghost",
    padding: "none",
    radius: "none",
    className: d("contact-method-card", m && "primary", s),
    children: [
      /* @__PURE__ */ a(t, { as: "span", className: "contact-method-icon", "aria-hidden": "true", children: o }),
      /* @__PURE__ */ a(t, { as: "strong", className: "contact-method-label", children: e }),
      /* @__PURE__ */ a(t, { className: "contact-method-desc", children: r }),
      c ? /* @__PURE__ */ a(t, { variant: "link-button", href: n, className: "contact-method-cta", children: c }) : /* @__PURE__ */ a(t, { variant: "link", href: n, className: "contact-method-link", children: n })
    ]
  }
);
export {
  k as JContactMethodCardView
};
//# sourceMappingURL=JContactMethodCardView.js.map
