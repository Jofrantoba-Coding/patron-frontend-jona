import { jsxs as m, jsx as e } from "react/jsx-runtime";
import { cn as t } from "../../lib/cn.js";
import { PanelAtomImpl as c } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { TextAtomImpl as o } from "../../atoms/TextAtom/TextAtomImpl.js";
const h = ({
  eyebrow: n,
  heading: a,
  description: s,
  className: i
}) => /* @__PURE__ */ m(c, { variant: "ghost", padding: "none", radius: "none", className: t("section-heading", i), children: [
  n && /* @__PURE__ */ e(o, { as: "span", className: "eyebrow", children: n }),
  /* @__PURE__ */ e(o, { as: "h2", className: "section-title", children: a }),
  s && /* @__PURE__ */ e(o, { className: "section-copy", children: s })
] });
export {
  h as SectionHeadingMoleculeView
};
//# sourceMappingURL=SectionHeadingMoleculeView.js.map
