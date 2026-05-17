import { jsxs as h, jsx as s } from "react/jsx-runtime";
import { cn as g } from "../../lib/cn.js";
const j = {
  default: "border border-neutral-300 bg-neutral-50 text-neutral-900",
  filled: "border-0 bg-neutral-100 text-neutral-900",
  ghost: "border-0 bg-transparent text-neutral-900"
}, p = {
  sm: "h-7 px-3 text-xs rounded",
  md: "h-9 px-3 text-sm rounded-md",
  lg: "h-11 px-4 text-base rounded-md"
}, v = /* @__PURE__ */ new Set(["sm", "md", "lg"]), S = ({
  variant: r = "default",
  size: e = "md",
  type: i = "text",
  hasError: t = !1,
  iconLeft: o,
  iconRight: a,
  className: d,
  style: l,
  forwardedRef: x,
  onChange: c,
  onBlur: u,
  onFocus: b,
  onKeyDown: f,
  onEnterPress: I,
  onClear: w,
  ...m
}) => {
  const n = typeof e == "string" && v.has(e) ? e : "md";
  return /* @__PURE__ */ h(
    "div",
    {
      className: "jtextbox-root",
      "data-jtextbox-variant": r,
      "data-jtextbox-size": n,
      "data-jtextbox-error": t ? "true" : void 0,
      "data-jtextbox-has-icon-left": !!o ? "true" : void 0,
      "data-jtextbox-has-icon-right": !!a ? "true" : void 0,
      style: l,
      children: [
        o && /* @__PURE__ */ s("span", { className: "jtextbox-icon jtextbox-icon--left", "aria-hidden": "true", children: o }),
        /* @__PURE__ */ s(
          "input",
          {
            ref: x,
            type: i,
            "aria-invalid": t || void 0,
            onChange: c,
            onBlur: u,
            onFocus: b,
            onKeyDown: f,
            className: g(
              "jtextbox",
              "w-full transition-colors duration-200",
              "placeholder:text-neutral-400",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-50",
              j[r],
              p[n],
              t ? "border-danger-500 focus-visible:ring-danger-500" : "focus-visible:ring-primary-500",
              d
            ),
            ...m
          }
        ),
        a && /* @__PURE__ */ s("span", { className: "jtextbox-icon jtextbox-icon--right", "aria-hidden": "true", children: a })
      ]
    }
  );
};
export {
  S as JTextBoxView
};
//# sourceMappingURL=JTextBoxView.js.map
