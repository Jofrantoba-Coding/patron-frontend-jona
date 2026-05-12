import { jsx as e } from "react/jsx-runtime";
import { cn as i } from "../../lib/cn.js";
import { PanelAtomImpl as m } from "../PanelAtom/PanelAtomImpl.js";
const d = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-lg"
}, x = {
  circle: "rounded-full",
  square: "rounded-md"
}, p = ({
  src: r,
  alt: t,
  initials: s,
  size: o,
  shape: l,
  className: n,
  onImageError: a
}) => /* @__PURE__ */ e(
  m,
  {
    variant: "ghost",
    padding: "none",
    radius: "none",
    className: i(
      "relative inline-flex items-center justify-center overflow-hidden bg-primary-100 text-primary-700 font-semibold flex-shrink-0",
      d[o],
      x[l],
      n
    ),
    "aria-label": t || s,
    children: r ? /* @__PURE__ */ e(
      "img",
      {
        src: r,
        alt: t,
        className: "w-full h-full object-cover",
        onError: a
      }
    ) : /* @__PURE__ */ e("span", { "aria-hidden": "true", children: s ?? "?" })
  }
);
export {
  p as AvatarAtomView
};
//# sourceMappingURL=AvatarAtomView.js.map
