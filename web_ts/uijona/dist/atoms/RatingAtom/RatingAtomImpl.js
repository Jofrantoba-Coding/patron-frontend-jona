import { jsx as y } from "react/jsx-runtime";
import { useState as i } from "react";
import { RATING_ATOM_DEFAULTS as m } from "./InterRatingAtom.js";
import { RatingAtomView as A } from "./RatingAtomView.js";
const O = (e) => {
  const t = { ...m, ...e }, [r, u] = i(m.value), [c, l] = i(null), o = e.value ?? r, d = (n) => {
    var a;
    t.readOnly || (u(n), (a = e.onChange) == null || a.call(e, n));
  }, v = (n) => {
    var a;
    t.readOnly || (l(n), (a = e.onHover) == null || a.call(e, n));
  }, f = () => {
    var n;
    t.readOnly || (l(null), (n = e.onHover) == null || n.call(e, null));
  };
  return /* @__PURE__ */ y(
    A,
    {
      value: o,
      max: t.max,
      readOnly: t.readOnly,
      size: t.size,
      hovered: c,
      className: e.className,
      onStarClick: d,
      onStarEnter: v,
      onStarLeave: f
    }
  );
};
O.displayName = "RatingAtom";
export {
  O as RatingAtomImpl
};
//# sourceMappingURL=RatingAtomImpl.js.map
