import { jsxs as d, jsx as a } from "react/jsx-runtime";
import { cn as m } from "../../lib/cn.js";
import { JLabelImpl as e } from "../../atoms/JLabel/JLabelImpl.js";
const p = ({
  name: l,
  outcome: r,
  href: t,
  linkLabel: s,
  className: i
}) => /* @__PURE__ */ d(e, { variant: "link", href: t, className: m("detail-related-card", i), children: [
  /* @__PURE__ */ a(e, { as: "strong", className: "detail-related-name", children: l }),
  /* @__PURE__ */ a(e, { className: "detail-related-outcome", children: r }),
  /* @__PURE__ */ a(e, { as: "span", className: "detail-related-link", children: s })
] });
export {
  p as JRelatedItemView
};
//# sourceMappingURL=JRelatedItemView.js.map
