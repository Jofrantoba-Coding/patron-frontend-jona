import { jsxs as x, jsx as y } from "react/jsx-runtime";
import { useState as j } from "react";
import { cn as v } from "../../lib/cn.js";
import { JCHIP_DEFAULTS as n } from "./InterJChip.js";
const w = {
  default: "bg-neutral-100 text-neutral-700 border-neutral-200",
  primary: "bg-primary-50 text-primary-700 border-primary-200",
  success: "bg-green-50 text-success-600 border-green-200",
  warning: "bg-yellow-50 text-warning-600 border-yellow-200",
  danger: "bg-red-50 text-danger-600 border-red-200"
}, S = ({
  variant: i = n.variant,
  selected: a,
  removable: s = n.removable,
  onRemove: e,
  id: l,
  className: c,
  style: d,
  children: o,
  onClick: r,
  forwardedRef: p,
  ...u
}) => {
  const [f, b] = j(!1), m = a ?? f, g = (t) => {
    a === void 0 && b((h) => !h), r == null || r(t);
  };
  return /* @__PURE__ */ x(
    "span",
    {
      ref: p,
      id: l,
      "data-jchip-variant": i,
      "data-jchip-selected": m || void 0,
      className: v(
        "jchip",
        "inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-xs font-medium cursor-pointer",
        "data-[jchip-selected=true]:ring-2 data-[jchip-selected=true]:ring-primary-500 data-[jchip-selected=true]:ring-offset-1",
        w[i],
        c
      ),
      style: d,
      onClick: g,
      ...u,
      children: [
        o,
        s && /* @__PURE__ */ y(
          "button",
          {
            type: "button",
            "aria-label": "Remove",
            className: "ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
            onClick: (t) => {
              t.stopPropagation(), e == null || e();
            },
            children: "×"
          }
        )
      ]
    }
  );
};
S.displayName = "JChipView";
export {
  S as JChipView
};
//# sourceMappingURL=JChipView.js.map
