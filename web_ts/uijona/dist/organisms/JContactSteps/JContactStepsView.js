import { jsx as o, jsxs as r } from "react/jsx-runtime";
import { cn as c } from "../../lib/cn.js";
import { JPanelImpl as t } from "../../atoms/JPanel/JPanelImpl.js";
import { JSectionHeadingImpl as d } from "../../molecules/JSectionHeading/JSectionHeadingImpl.js";
import { JNumberedStepImpl as l } from "../../molecules/JNumberedStep/JNumberedStepImpl.js";
const N = ({
  eyebrow: e,
  heading: a,
  steps: i,
  as: s = "section",
  className: m
}) => /* @__PURE__ */ o(
  t,
  {
    as: s,
    variant: "ghost",
    padding: "none",
    radius: "none",
    className: c("contact-steps-section", m),
    children: /* @__PURE__ */ r(t, { variant: "ghost", padding: "none", radius: "none", className: "section-shell", children: [
      /* @__PURE__ */ o(d, { eyebrow: e, heading: a, className: "mb-10" }),
      /* @__PURE__ */ o(t, { variant: "ghost", padding: "none", radius: "none", className: "contact-steps-list", children: i.map((n) => /* @__PURE__ */ o(
        l,
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
  N as JContactStepsView
};
//# sourceMappingURL=JContactStepsView.js.map
