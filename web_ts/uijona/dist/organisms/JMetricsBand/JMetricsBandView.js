import { jsx as n, jsxs as l } from "react/jsx-runtime";
import { cn as m } from "../../lib/cn.js";
import { JPanelImpl as a } from "../../atoms/JPanel/JPanelImpl.js";
import { JGridLayoutImpl as c } from "../../layouts/JGridLayout/JGridLayoutImpl.js";
import { JLabelImpl as e } from "../../atoms/JLabel/JLabelImpl.js";
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
    className: m("metrics-section", t),
    children: /* @__PURE__ */ n(a, { variant: "ghost", padding: "none", radius: "none", className: "section-shell", children: /* @__PURE__ */ n(c, { autoFitMin: "260px", className: "metrics-grid", children: r.map((i) => /* @__PURE__ */ l(a, { variant: "ghost", padding: "none", radius: "none", className: "metric-item", children: [
      /* @__PURE__ */ n(e, { as: "strong", children: i.value }),
      /* @__PURE__ */ n(e, { as: "span", children: i.label })
    ] }, i.label)) }) })
  }
);
export {
  f as JMetricsBandView
};
//# sourceMappingURL=JMetricsBandView.js.map
