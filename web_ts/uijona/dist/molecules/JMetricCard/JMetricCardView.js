import { jsxs as m, jsx as r } from "react/jsx-runtime";
import { cn as a } from "../../lib/cn.js";
import { JPanelImpl as s } from "../../atoms/JPanel/JPanelImpl.js";
import { JLabelImpl as i } from "../../atoms/JLabel/JLabelImpl.js";
const d = ({
  value: n,
  label: o,
  className: e
}) => /* @__PURE__ */ m(s, { variant: "ghost", padding: "none", radius: "none", className: a("metric-item", e), children: [
  /* @__PURE__ */ r(i, { as: "strong", children: n }),
  /* @__PURE__ */ r(i, { as: "span", children: o })
] });
export {
  d as JMetricCardView
};
//# sourceMappingURL=JMetricCardView.js.map
