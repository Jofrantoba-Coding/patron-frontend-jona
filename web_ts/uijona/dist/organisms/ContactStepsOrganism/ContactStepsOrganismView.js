import { jsx as o, jsxs as r } from "react/jsx-runtime";
import { cn as c } from "../../lib/cn.js";
import { JPanelImpl as e } from "../../atoms/JPanel/JPanelImpl.js";
import { SectionHeadingMoleculeImpl as l } from "../../molecules/SectionHeadingMolecule/SectionHeadingMoleculeImpl.js";
import { NumberedStepMoleculeImpl as d } from "../../molecules/NumberedStepMolecule/NumberedStepMoleculeImpl.js";
const N = ({
  eyebrow: t,
  heading: a,
  steps: i,
  as: s = "section",
  className: m
}) => /* @__PURE__ */ o(
  e,
  {
    as: s,
    variant: "ghost",
    padding: "none",
    radius: "none",
    className: c("contact-steps-section", m),
    children: /* @__PURE__ */ r(e, { variant: "ghost", padding: "none", radius: "none", className: "section-shell", children: [
      /* @__PURE__ */ o(l, { eyebrow: t, heading: a, className: "mb-10" }),
      /* @__PURE__ */ o(e, { variant: "ghost", padding: "none", radius: "none", className: "contact-steps-list", children: i.map((n) => /* @__PURE__ */ o(
        d,
        {
          num: n.num,
          title: n.title,
          body: n.body
        },
        n.num
      )) })
    ] })
  }
);
export {
  N as ContactStepsOrganismView
};
//# sourceMappingURL=ContactStepsOrganismView.js.map
