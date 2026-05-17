import { jsxs as n, jsx as r } from "react/jsx-runtime";
import { cn as t } from "../../lib/cn.js";
import { JPanelImpl as s } from "../../atoms/JPanel/JPanelImpl.js";
import { TextAtomImpl as o } from "../../atoms/TextAtom/TextAtomImpl.js";
const d = ({
  value: e,
  label: i,
  className: m
}) => /* @__PURE__ */ n(s, { variant: "ghost", padding: "none", radius: "none", className: t("metric-item", m), children: [
  /* @__PURE__ */ r(o, { as: "strong", children: e }),
  /* @__PURE__ */ r(o, { as: "span", children: i })
] });
export {
  d as MetricCardMoleculeView
};
//# sourceMappingURL=MetricCardMoleculeView.js.map
