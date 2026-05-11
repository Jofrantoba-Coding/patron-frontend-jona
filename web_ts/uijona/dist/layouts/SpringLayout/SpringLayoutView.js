import { jsx as j } from "react/jsx-runtime";
import o from "react";
import { cn as y } from "../../lib/cn.js";
import { layoutGapClasses as u, toCssValue as t } from "../layoutPrimitives.js";
import { PanelAtomImpl as f } from "../../atoms/PanelAtom/PanelAtomImpl.js";
const d = (a) => o.Children.map(a, (r) => {
  if (!o.isValidElement(r)) return r;
  const n = {
    ...r.props.style,
    "--jona-spring-left": t(r.props["data-spring-left"]),
    "--jona-spring-right": t(r.props["data-spring-right"]),
    "--jona-spring-top": t(r.props["data-spring-top"]),
    "--jona-spring-bottom": t(r.props["data-spring-bottom"]),
    "--jona-spring-width": t(r.props["data-spring-width"]),
    "--jona-spring-height": t(r.props["data-spring-height"])
  };
  return o.cloneElement(r, {
    "data-jona-spring-item": "",
    style: n
  });
}), w = o.forwardRef(
  ({
    children: a,
    className: r,
    style: n,
    gap: p = "md",
    autoFitMin: s = "12rem",
    minHeight: e = "16rem",
    placement: i = "responsive",
    ...m
  }, g) => {
    const l = {
      "--jona-layout-min": s,
      "--jona-spring-min-height": e,
      ...n
    };
    return /* @__PURE__ */ j(
      f,
      {
        ref: g,
        className: y("jona-spring-layout", u[p], r),
        "data-jona-layout-placement": i,
        style: l,
        ...m,
        children: d(a)
      }
    );
  }
);
w.displayName = "SpringLayoutView";
export {
  w as SpringLayoutView
};
//# sourceMappingURL=SpringLayoutView.js.map
