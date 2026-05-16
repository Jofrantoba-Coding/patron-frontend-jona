import { jsxs as i, jsx as a } from "react/jsx-runtime";
import { cn as r } from "../../lib/cn.js";
import { PanelAtomImpl as l } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { TextAtomImpl as e } from "../../atoms/TextAtom/TextAtomImpl.js";
const p = ({
  question: m,
  answer: o,
  className: t
}) => /* @__PURE__ */ i(l, { variant: "ghost", padding: "none", radius: "none", className: r("detail-faq-item", t), children: [
  /* @__PURE__ */ a(e, { as: "strong", className: "detail-faq-q", children: m }),
  /* @__PURE__ */ a(e, { className: "detail-faq-a", children: o })
] });
export {
  p as FaqItemMoleculeView
};
//# sourceMappingURL=FaqItemMoleculeView.js.map
