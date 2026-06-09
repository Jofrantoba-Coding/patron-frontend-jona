import { jsxs as c, jsx as e } from "react/jsx-runtime";
import { cn as m } from "../../lib/cn.js";
import { JPanelImpl as r } from "../../atoms/JPanel/JPanelImpl.js";
import { JLabelImpl as a } from "../../atoms/JLabel/JLabelImpl.js";
const h = ({
  eyebrow: n,
  heading: i,
  description: s,
  className: o
}) => /* @__PURE__ */ c(r, { variant: "ghost", padding: "none", radius: "none", className: m("section-heading", o), children: [
  n && /* @__PURE__ */ e(a, { as: "span", className: "eyebrow", children: n }),
  /* @__PURE__ */ e(a, { as: "h2", className: "section-title", children: i }),
  s && /* @__PURE__ */ e(a, { className: "section-copy", children: s })
] });
export {
  h as JSectionHeadingView
};
//# sourceMappingURL=JSectionHeadingView.js.map
