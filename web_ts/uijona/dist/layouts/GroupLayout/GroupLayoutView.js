import { jsx as f } from "react/jsx-runtime";
import a from "react";
import { cn as g } from "../../lib/cn.js";
import { layoutJustifyClasses as d, layoutAlignClasses as c, layoutGapClasses as C, resolveGridTemplate as G, toCssValue as V } from "../layoutPrimitives.js";
import { PanelAtomImpl as w } from "../../atoms/PanelAtom/PanelAtomImpl.js";
const v = (t) => a.Children.map(t, (o) => {
  if (!a.isValidElement(o)) return o;
  const r = {
    ...o.props.style,
    "--jona-group-span": V(o.props["data-group-span"]),
    "--jona-group-align": o.props["data-group-align"],
    "--jona-group-justify": o.props["data-group-justify"]
  };
  return a.cloneElement(o, {
    "data-jona-group-item": "",
    style: r
  });
}), x = a.forwardRef(
  ({
    children: t,
    className: o,
    style: r,
    gap: s = "md",
    alignItems: p = "stretch",
    justifyContent: l = "start",
    columns: n,
    autoFitMin: u = "12rem",
    mode: e = "sequential",
    placement: m = "responsive",
    ...i
  }, y) => {
    const j = {
      "--jona-layout-min": u,
      "--jona-layout-columns": G(n),
      ...r
    };
    return /* @__PURE__ */ f(
      w,
      {
        ref: y,
        className: g(
          "jona-layout-mobile-grid jona-group-layout",
          e === "parallel" && "justify-items-stretch",
          C[s],
          c[p],
          d[l],
          o
        ),
        "data-jona-layout-mode": e,
        "data-jona-layout-placement": m,
        style: j,
        ...i,
        children: v(t)
      }
    );
  }
);
x.displayName = "GroupLayoutView";
export {
  x as GroupLayoutView
};
//# sourceMappingURL=GroupLayoutView.js.map
