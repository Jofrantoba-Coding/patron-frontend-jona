import { jsxs as n, jsx as t } from "react/jsx-runtime";
import { cn as m } from "../../lib/cn.js";
import { PanelAtomImpl as s } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { TextAtomImpl as e } from "../../atoms/TextAtom/TextAtomImpl.js";
const h = ({
  num: a,
  title: o,
  body: c,
  className: r
}) => /* @__PURE__ */ n(s, { variant: "ghost", padding: "none", radius: "none", className: m("contact-step", r), children: [
  /* @__PURE__ */ t(e, { as: "span", className: "contact-step-num", children: a }),
  /* @__PURE__ */ n(s, { variant: "ghost", padding: "none", radius: "none", className: "contact-step-body", children: [
    /* @__PURE__ */ t(e, { as: "strong", className: "contact-step-title", children: o }),
    /* @__PURE__ */ t(e, { className: "contact-step-desc", children: c })
  ] })
] });
export {
  h as NumberedStepMoleculeView
};
//# sourceMappingURL=NumberedStepMoleculeView.js.map
