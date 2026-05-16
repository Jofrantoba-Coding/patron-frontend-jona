import { jsx as c } from "react/jsx-runtime";
import d from "react";
import { cn as i } from "../../lib/cn.js";
const r = {
  contain: "object-contain",
  cover: "object-cover",
  fill: "object-fill",
  none: "object-none",
  "scale-down": "object-scale-down"
}, m = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full"
}, u = {
  auto: void 0,
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[21/9]",
  portrait: "aspect-[3/4]"
}, f = d.forwardRef(
  ({
    fit: o,
    radius: e,
    aspectRatio: s,
    block: n,
    className: t,
    ...a
  }, l) => /* @__PURE__ */ c(
    "img",
    {
      ref: l,
      className: i(
        "max-w-full min-w-0 shrink-0",
        n ? "block w-full" : "inline-block",
        r[o],
        m[e],
        u[s],
        t
      ),
      ...a
    }
  )
);
f.displayName = "ImageAtomView";
export {
  f as ImageAtomView
};
//# sourceMappingURL=ImageAtomView.js.map
