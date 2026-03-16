import { jsx as i } from "react/jsx-runtime";
import p from "react";
import { cn as d } from "../lib/cn.js";
const f = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl"
}, j = ({ src: r, alt: l = "", fallback: t, size: n = "md", className: m, onImageError: e, onClick: o }) => {
  const [a, x] = p.useState(!1), c = !r || a, h = t ? t.split(" ").map((s) => s[0]).join("").toUpperCase().slice(0, 2) : "?";
  return /* @__PURE__ */ i(
    "span",
    {
      className: d(
        "inline-flex items-center justify-center rounded-full overflow-hidden",
        "bg-primary-600 text-white font-semibold flex-shrink-0",
        o && "cursor-pointer",
        f[n],
        m
      ),
      "aria-label": l || t,
      onClick: o,
      children: c ? /* @__PURE__ */ i("span", { "aria-hidden": "true", children: h }) : /* @__PURE__ */ i("img", { src: r, alt: l, className: "w-full h-full object-cover", onError: (s) => {
        x(!0), e == null || e(s);
      } })
    }
  );
};
export {
  j as AvatarAtom
};
//# sourceMappingURL=AvatarAtom.js.map
