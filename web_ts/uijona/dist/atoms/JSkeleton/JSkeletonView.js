import { jsx as l } from "react/jsx-runtime";
import { cn as s } from "../../lib/cn.js";
import { JSKELETON_DEFAULTS as t } from "./InterJSkeleton.js";
const i = {
  pulse: "animate-pulse bg-neutral-200",
  wave: "jskeleton-wave",
  none: "bg-neutral-200"
}, d = ({
  circle: e = t.circle,
  variant: a = t.variant,
  className: n,
  style: o,
  forwardedRef: r
}) => /* @__PURE__ */ l(
  "div",
  {
    ref: r,
    "aria-hidden": "true",
    "data-jskeleton-variant": a,
    "data-jskeleton-circle": e || void 0,
    style: o,
    className: s(
      "jskeleton",
      i[a],
      e ? "rounded-full" : "rounded",
      n
    )
  }
);
d.displayName = "JSkeletonView";
export {
  d as JSkeletonView
};
//# sourceMappingURL=JSkeletonView.js.map
