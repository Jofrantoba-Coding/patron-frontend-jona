import { jsxs as i, jsx as r } from "react/jsx-runtime";
import { cn as n } from "../../lib/cn.js";
import { PanelAtomImpl as s } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { TextAtomImpl as o } from "../../atoms/TextAtom/TextAtomImpl.js";
const d = ({
  value: e,
  label: m,
  className: t
}) => /* @__PURE__ */ i(s, { variant: "ghost", padding: "none", radius: "none", className: n("metric-item", t), children: [
  /* @__PURE__ */ r(o, { as: "strong", children: e }),
  /* @__PURE__ */ r(o, { as: "span", children: m })
] });
export {
  d as MetricCardMoleculeView
};
//# sourceMappingURL=MetricCardMoleculeView.js.map
