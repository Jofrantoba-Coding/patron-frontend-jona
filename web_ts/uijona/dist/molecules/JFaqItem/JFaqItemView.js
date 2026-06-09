import { jsxs as o, jsx as a } from "react/jsx-runtime";
import { cn as s } from "../../lib/cn.js";
import { JPanelImpl as t } from "../../atoms/JPanel/JPanelImpl.js";
import { JLabelImpl as e } from "../../atoms/JLabel/JLabelImpl.js";
const p = ({
  question: i,
  answer: m,
  className: r
}) => /* @__PURE__ */ o(t, { variant: "ghost", padding: "none", radius: "none", className: s("detail-faq-item", r), children: [
  /* @__PURE__ */ a(e, { as: "strong", className: "detail-faq-q", children: i }),
  /* @__PURE__ */ a(e, { className: "detail-faq-a", children: m })
] });
export {
  p as JFaqItemView
};
//# sourceMappingURL=JFaqItemView.js.map
