import { jsx as e } from "react/jsx-runtime";
import { useState as v, useEffect as p } from "react";
import { cn as w } from "../../lib/cn.js";
const b = {
  xs: "w-6  h-6  text-xs",
  sm: "w-8  h-8  text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-lg"
}, g = {
  circle: "rounded-full",
  square: "rounded-md"
}, q = ({
  src: t,
  alt: s = "",
  initials: r,
  size: d = "md",
  shape: i = "circle",
  className: c,
  style: n,
  onImageError: a,
  forwardedRef: h
}) => {
  const [x, o] = v(!1);
  p(() => {
    o(!1);
  }, [t]);
  const f = (u) => {
    o(!0), a == null || a(u);
  }, l = !!t && !x, m = s || r || void 0;
  return /* @__PURE__ */ e(
    "div",
    {
      ref: h,
      className: w(
        "javatar",
        "bg-primary-100 text-primary-700 font-semibold",
        b[d],
        g[i],
        c
      ),
      style: n,
      "data-javatar-size": d,
      "data-javatar-shape": i,
      "data-javatar-has-image": l ? "true" : void 0,
      role: m ? "img" : void 0,
      "aria-label": m,
      children: l ? /* @__PURE__ */ e("img", { src: t, alt: s, onError: f }) : /* @__PURE__ */ e("span", { "aria-hidden": "true", children: r ?? "?" })
    }
  );
};
export {
  q as JAvatarView
};
//# sourceMappingURL=JAvatarView.js.map
