import { jsxs as c, jsx as e } from "react/jsx-runtime";
import { cn as m } from "../../lib/cn.js";
import { JPanelImpl as t } from "../../atoms/JPanel/JPanelImpl.js";
import { TextAtomImpl as n } from "../../atoms/TextAtom/TextAtomImpl.js";
const h = ({
  eyebrow: o,
  heading: a,
  description: s,
  className: i
}) => /* @__PURE__ */ c(t, { variant: "ghost", padding: "none", radius: "none", className: m("section-heading", i), children: [
  o && /* @__PURE__ */ e(n, { as: "span", className: "eyebrow", children: o }),
  /* @__PURE__ */ e(n, { as: "h2", className: "section-title", children: a }),
  s && /* @__PURE__ */ e(n, { className: "section-copy", children: s })
] });
export {
  h as SectionHeadingMoleculeView
};
//# sourceMappingURL=SectionHeadingMoleculeView.js.map
