import { jsx as y } from "react/jsx-runtime";
import { useState as i } from "react";
import { RATING_MOLECULE_DEFAULTS as u } from "./InterRatingMolecule.js";
import { RatingMoleculeView as O } from "./RatingMoleculeView.js";
const g = (e) => {
  const l = { ...u, ...e }, [c, m] = i(u.value), [r, t] = i(null), o = e.value ?? c, d = (n) => {
    var a;
    l.readOnly || (m(n), (a = e.onChange) == null || a.call(e, n));
  }, v = (n) => {
    var a;
    l.readOnly || (t(n), (a = e.onHover) == null || a.call(e, n));
  }, f = () => {
    var n;
    l.readOnly || (t(null), (n = e.onHover) == null || n.call(e, null));
  };
  return /* @__PURE__ */ y(
    O,
    {
      value: o,
      max: l.max,
      readOnly: l.readOnly,
      size: l.size,
      hovered: r,
      className: e.className,
      onStarClick: d,
      onStarEnter: v,
      onStarLeave: f
    }
  );
};
g.displayName = "RatingMolecule";
export {
  g as RatingMoleculeImpl
};
//# sourceMappingURL=RatingMoleculeImpl.js.map
