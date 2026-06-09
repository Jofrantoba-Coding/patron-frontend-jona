import { jsxs as C, jsx as z } from "react/jsx-runtime";
import { cn as D } from "../../lib/cn.js";
const L = {
  body: "text-neutral-900",
  heading: "font-semibold text-neutral-900",
  label: "text-sm font-medium text-neutral-700",
  link: "text-primary-600 underline-offset-4 hover:underline cursor-pointer",
  "link-muted": "text-neutral-500 underline-offset-4 hover:underline cursor-pointer",
  "link-button": "inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 cursor-pointer",
  "link-danger": "text-danger-500 underline-offset-4 hover:underline cursor-pointer",
  error: "text-xs text-danger-500",
  description: "text-xs text-neutral-500"
}, A = {
  body: "p",
  heading: "p",
  label: "label",
  link: "a",
  "link-muted": "a",
  "link-button": "a",
  "link-danger": "a",
  error: "p",
  description: "p"
}, N = {
  body: "base",
  label: "sm",
  error: "xs",
  description: "xs"
}, S = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl"
}, T = {
  default: "",
  muted: "text-neutral-500",
  primary: "text-primary-600",
  danger: "text-danger-500",
  success: "text-success-600",
  warning: "text-warning-600"
}, B = ({
  as: d,
  variant: e = "body",
  size: u,
  color: n = "default",
  truncate: p = !1,
  htmlFor: f,
  required: m = !1,
  href: b,
  target: s,
  rel: l,
  message: o,
  disabled: t = !1,
  className: g,
  style: k,
  children: y,
  forwardedRef: h,
  ...v
}) => {
  const a = y ?? o ?? void 0;
  if ((e === "error" || e === "description") && !a)
    return null;
  const r = d ?? A[e], i = u ?? N[e], x = r === "a", c = r === "label", j = D(
    L[e],
    i && S[i],
    n !== "default" && T[n],
    p && "jlabel-truncate",
    t && "opacity-50",
    x && t && "pointer-events-none",
    g
  ), P = x ? {
    href: t ? void 0 : b,
    target: s,
    rel: s === "_blank" ? l ?? "noopener noreferrer" : l,
    "aria-disabled": t || void 0,
    tabIndex: t ? -1 : void 0,
    ...t ? { onClick: (w) => w.preventDefault() } : {}
  } : {};
  return /* @__PURE__ */ C(
    r,
    {
      ref: h,
      className: j,
      style: k,
      "data-jlabel-variant": e,
      ...v,
      ...e === "error" ? { role: "alert" } : {},
      ...c ? { htmlFor: f } : {},
      ...P,
      children: [
        a,
        (c || e === "label") && m && /* @__PURE__ */ z("span", { className: "ml-0.5 text-danger-500", "aria-hidden": "true", children: "*" })
      ]
    }
  );
};
export {
  B as JLabelView
};
//# sourceMappingURL=JLabelView.js.map
