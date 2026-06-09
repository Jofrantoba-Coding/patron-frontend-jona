import { jsxs as e, jsx as t } from "react/jsx-runtime";
import { cn as i } from "../../lib/cn.js";
import { JPanelImpl as n } from "../../atoms/JPanel/JPanelImpl.js";
import { JLabelImpl as a } from "../../atoms/JLabel/JLabelImpl.js";
const h = ({
  num: s,
  title: c,
  body: o,
  className: r
}) => /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: i("contact-step", r), children: [
  /* @__PURE__ */ t(a, { as: "span", className: "contact-step-num", children: s }),
  /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: "contact-step-body", children: [
    /* @__PURE__ */ t(a, { as: "strong", className: "contact-step-title", children: c }),
    /* @__PURE__ */ t(a, { className: "contact-step-desc", children: o })
  ] })
] });
export {
  h as JNumberedStepView
};
//# sourceMappingURL=JNumberedStepView.js.map
