import { jsx as a } from "react/jsx-runtime";
import { cn as e } from "../../lib/cn.js";
import { JPanelImpl as n } from "../../atoms/JPanel/JPanelImpl.js";
import { JContactMethodCardImpl as c } from "../../molecules/JContactMethodCard/JContactMethodCardImpl.js";
import { JGridLayoutImpl as s } from "../../layouts/JGridLayout/JGridLayoutImpl.js";
const h = ({
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
  h as JContactMethodsView
};
//# sourceMappingURL=JContactMethodsView.js.map
