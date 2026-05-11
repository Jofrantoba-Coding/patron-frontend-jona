import { jsx as c } from "react/jsx-runtime";
import r from "react";
import { cn as f } from "../../lib/cn.js";
import { layoutJustifyClasses as w, layoutAlignClasses as C, layoutGapClasses as G, resolveGridTemplate as e, toCssValue as t } from "../layoutPrimitives.js";
import { PanelAtomImpl as B } from "../../atoms/PanelAtom/PanelAtomImpl.js";
const V = (a) => t(a["data-gridbag-column"] ?? a["data-gridbag-col"]), R = (a) => t(a["data-gridbag-column-span"] ?? a["data-gridbag-colspan"]), S = (a) => t(a["data-gridbag-row-span"] ?? a["data-gridbag-rowspan"]), v = (a) => r.Children.map(a, (o) => {
  if (!r.isValidElement(o)) return o;
  const n = {
    ...o.props.style,
    "--jona-gridbag-column": V(o.props),
    "--jona-gridbag-row": t(o.props["data-gridbag-row"]),
    "--jona-gridbag-column-span": R(o.props),
    "--jona-gridbag-row-span": S(o.props),
    "--jona-gridbag-align": o.props["data-gridbag-align"],
    "--jona-gridbag-justify": o.props["data-gridbag-justify"]
  };
  return r.cloneElement(o, {
    "data-jona-gridbag-item": "",
    style: n
  });
}), x = r.forwardRef(
  ({
    children: a,
    className: o,
    style: n,
    gap: s = "md",
    alignItems: g = "stretch",
    justifyContent: i = "start",
    columns: l,
    rows: d,
    autoFitMin: m = "12rem",
    dense: p = !0,
    placement: u = "responsive",
    ...y
  }, b) => {
    const j = {
      "--jona-layout-min": m,
      "--jona-layout-columns": e(l),
      "--jona-layout-rows": e(d),
      ...n
    };
    return /* @__PURE__ */ c(
      B,
      {
        ref: b,
        className: f(
          "jona-layout-mobile-grid jona-gridbag",
          G[s],
          C[g],
          w[i],
          o
        ),
        "data-jona-layout-placement": u,
        "data-jona-layout-dense": p ? "true" : "false",
        style: j,
        ...y,
        children: v(a)
      }
    );
  }
);
x.displayName = "GridBagLayoutView";
export {
  x as GridBagLayoutView
};
//# sourceMappingURL=GridBagLayoutView.js.map
