import { jsx as c } from "react/jsx-runtime";
import { useState as y } from "react";
import { cn as f } from "../../lib/cn.js";
import { JSWITCH_DEFAULTS as a } from "./InterJSwitch.js";
const S = {
  sm: "w-8 h-4",
  md: "w-11 h-6",
  lg: "w-14 h-7"
}, j = {
  sm: "w-3 h-3",
  md: "w-5 h-5",
  lg: "w-6 h-6"
}, d = {
  sm: { on: "translate-x-4", off: "translate-x-0.5" },
  md: { on: "translate-x-5", off: "translate-x-0.5" },
  lg: { on: "translate-x-7", off: "translate-x-0.5" }
}, k = ({
  checked: n,
  hasError: i = a.hasError,
  disabled: l = a.disabled,
  size: t = a.size,
  id: m,
  "aria-labelledby": b,
  "aria-label": u,
  className: w,
  style: h,
  onCheckedChange: r,
  forwardedRef: p
}) => {
  const [x, g] = y(!1), o = n !== void 0, e = o ? n : x;
  return /* @__PURE__ */ c(
    "button",
    {
      ref: p,
      id: m,
      type: "button",
      role: "switch",
      "aria-checked": e,
      "aria-labelledby": b,
      "aria-label": u,
      disabled: l,
      "data-jswitch-size": t,
      "data-jswitch-error": i || void 0,
      onClick: (v) => {
        if (l) return;
        const s = !e;
        o || g(s), r == null || r(s, v);
      },
      style: h,
      className: f(
        "jswitch",
        "relative inline-flex items-center rounded-full transition-colors duration-200 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500",
        "disabled:pointer-events-none disabled:opacity-50",
        S[t],
        e ? i ? "bg-danger-500" : "bg-primary-600" : i ? "bg-danger-200" : "bg-neutral-300",
        w
      ),
      children: /* @__PURE__ */ c(
        "span",
        {
          className: f(
            "inline-block rounded-full bg-white shadow transition-transform duration-200",
            j[t],
            e ? d[t].on : d[t].off
          )
        }
      )
    }
  );
};
k.displayName = "JSwitchView";
export {
  k as JSwitchView
};
//# sourceMappingURL=JSwitchView.js.map
