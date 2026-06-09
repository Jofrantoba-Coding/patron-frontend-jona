import { jsx as y } from "react/jsx-runtime";
import { useState as r } from "react";
import { JRATING_DEFAULTS as g } from "./InterJRating.js";
import { JRatingView as h } from "./JRatingView.js";
const x = (e) => {
  const t = { ...g, ...e }, [c, u] = r(0), [d, l] = r(null), i = e.value ?? c, o = (n) => {
    var m;
    if (t.readOnly) return;
    const a = n === i ? 0 : n;
    u(a), (m = e.onChange) == null || m.call(e, a);
  }, f = (n) => {
    var a;
    t.readOnly || (l(n), (a = e.onHover) == null || a.call(e, n));
  }, v = () => {
    var n;
    t.readOnly || (l(null), (n = e.onHover) == null || n.call(e, null));
  };
  return /* @__PURE__ */ y(
    h,
    {
      value: i,
      max: t.max,
      readOnly: t.readOnly,
      size: t.size,
      hovered: d,
      className: e.className,
      onStarClick: o,
      onStarEnter: f,
      onStarLeave: v
    }
  );
};
x.displayName = "JRating";
export {
  x as JRatingImpl
};
//# sourceMappingURL=JRatingImpl.js.map
