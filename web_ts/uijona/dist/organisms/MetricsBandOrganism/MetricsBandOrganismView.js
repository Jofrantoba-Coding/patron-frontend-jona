import { jsx as n, jsxs as m } from "react/jsx-runtime";
import { cn as l } from "../../lib/cn.js";
import { JPanelImpl as a } from "../../atoms/JPanel/JPanelImpl.js";
import { GridLayoutImpl as c } from "../../layouts/GridLayout/GridLayoutImpl.js";
import { TextAtomImpl as e } from "../../atoms/TextAtom/TextAtomImpl.js";
const f = ({
  metrics: r,
  as: s = "section",
  id: o,
  className: t
}) => /* @__PURE__ */ n(
  a,
  {
    as: s,
    id: o,
    variant: "ghost",
    padding: "none",
    radius: "none",
    className: l("metrics-section", t),
    children: /* @__PURE__ */ n(a, { variant: "ghost", padding: "none", radius: "none", className: "section-shell", children: /* @__PURE__ */ n(c, { autoFitMin: "260px", className: "metrics-grid", children: r.map((i) => /* @__PURE__ */ m(a, { variant: "ghost", padding: "none", radius: "none", className: "metric-item", children: [
      /* @__PURE__ */ n(e, { as: "strong", children: i.value }),
      /* @__PURE__ */ n(e, { as: "span", children: i.label })
    ] }, i.label)) }) })
  }
);
export {
  f as MetricsBandOrganismView
};
//# sourceMappingURL=MetricsBandOrganismView.js.map
