import { jsxs as i, jsx as e } from "react/jsx-runtime";
import { cn as o } from "../../lib/cn.js";
import { PanelAtomImpl as t } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { TextAtomImpl as m } from "../../atoms/TextAtom/TextAtomImpl.js";
const p = ({
  text: n,
  className: a
}) => /* @__PURE__ */ i(t, { variant: "ghost", padding: "none", radius: "none", className: o("detail-benefit-card", a), children: [
  /* @__PURE__ */ e(t, { as: "span", variant: "ghost", padding: "none", radius: "none", className: "detail-benefit-dot" }),
  /* @__PURE__ */ e(m, { className: "detail-benefit-text", children: n })
] });
export {
  p as BenefitItemMoleculeView
};
//# sourceMappingURL=BenefitItemMoleculeView.js.map
