import { jsx as e } from "react/jsx-runtime";
import { cn as n } from "../../lib/cn.js";
const m = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-lg"
}, d = {
  circle: "rounded-full",
  square: "rounded-md"
}, h = ({
  src: r,
  alt: s,
  initials: t,
  size: l,
  shape: i,
  className: o,
  onImageError: a
}) => /* @__PURE__ */ e(
  "div",
  {
    className: n(
      "relative inline-flex items-center justify-center overflow-hidden bg-primary-100 text-primary-700 font-semibold flex-shrink-0",
      m[l],
      d[i],
      o
    ),
    "aria-label": s || t,
    children: r ? /* @__PURE__ */ e(
      "img",
      {
        src: r,
        alt: s,
        className: "w-full h-full object-cover",
        onError: a
      }
    ) : /* @__PURE__ */ e("span", { "aria-hidden": "true", children: t ?? "?" })
  }
);
export {
  h as AvatarAtomView
};
//# sourceMappingURL=AvatarAtomView.js.map
