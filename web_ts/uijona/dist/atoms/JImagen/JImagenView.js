import { jsx as w } from "react/jsx-runtime";
import { useState as b, useEffect as g } from "react";
import { cn as x } from "../../lib/cn.js";
const C = {
  contain: "object-contain",
  cover: "object-cover",
  fill: "object-fill",
  none: "object-none",
  "scale-down": "object-scale-down"
}, h = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full"
}, q = {
  auto: void 0,
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[21/9]",
  portrait: "aspect-[3/4]"
}, J = ({
  src: e,
  alt: l,
  fit: s = "cover",
  radius: a = "none",
  aspectRatio: n = "auto",
  block: d = !1,
  loading: r = "lazy",
  decoding: u = "async",
  fallbackSrc: o,
  className: m,
  style: f,
  onImageError: t,
  forwardedRef: j
}) => {
  const [i, c] = b(e);
  g(() => {
    c(e);
  }, [e]);
  const p = (v) => {
    o && i !== o && c(o), t == null || t(v);
  };
  return /* @__PURE__ */ w(
    "img",
    {
      ref: j,
      src: i,
      alt: l,
      loading: r,
      decoding: u,
      "data-jimagen-fit": s,
      "data-jimagen-radius": a,
      "data-jimagen-aspect": n !== "auto" ? n : void 0,
      "data-jimagen-block": d ? "true" : void 0,
      className: x(
        "jimagen",
        "max-w-full min-w-0 shrink-0",
        d ? "block w-full" : "inline-block",
        C[s],
        h[a],
        q[n],
        m
      ),
      style: f,
      onError: p
    }
  );
};
export {
  J as JImagenView
};
//# sourceMappingURL=JImagenView.js.map
