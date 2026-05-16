import { jsxs as s, jsx as e } from "react/jsx-runtime";
import { cn as i } from "../../lib/cn.js";
import { LinkAtomImpl as d } from "../../atoms/LinkAtom/LinkAtomImpl.js";
import { TextAtomImpl as a } from "../../atoms/TextAtom/TextAtomImpl.js";
const h = ({
  name: l,
  outcome: t,
  href: m,
  linkLabel: r,
  className: o
}) => /* @__PURE__ */ s(d, { href: m, className: i("detail-related-card", o), children: [
  /* @__PURE__ */ e(a, { as: "strong", className: "detail-related-name", children: l }),
  /* @__PURE__ */ e(a, { className: "detail-related-outcome", children: t }),
  /* @__PURE__ */ e(a, { as: "span", className: "detail-related-link", children: r })
] });
export {
  h as RelatedItemMoleculeView
};
//# sourceMappingURL=RelatedItemMoleculeView.js.map
