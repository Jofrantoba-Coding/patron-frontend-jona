import { jsx as y } from "react/jsx-runtime";
import { useRef as j, useEffect as z } from "react";
import { cn as H } from "../../lib/cn.js";
const w = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize"
}, A = {
  sm: "min-h-[60px] text-xs px-2 py-1.5",
  md: "min-h-[80px] text-sm px-3 py-2",
  lg: "min-h-[100px] text-base px-4 py-2.5"
}, C = {
  default: "bg-white border-neutral-300",
  filled: "bg-neutral-50 border-neutral-200"
}, V = ({
  hasError: r = !1,
  autoResize: o = !1,
  resize: l = "both",
  disabled: d = !1,
  size: u = "md",
  variant: c = "default",
  className: f,
  style: x,
  onChange: a,
  onFocus: p,
  onBlur: i,
  onKeyDown: b,
  forwardedRef: t,
  ...m
}) => {
  const s = j(null), n = (e) => {
    o && (e.style.height = "auto", e.style.height = `${e.scrollHeight}px`);
  };
  z(() => {
    s.current && n(s.current);
  });
  const g = (e) => {
    s.current = e, e && n(e), t && (typeof t == "function" ? t(e) : t.current = e);
  }, v = (e) => {
    n(e.target), a == null || a(e.target.value, e);
  }, h = (e) => i == null ? void 0 : i(e.target.value, e);
  return /* @__PURE__ */ y(
    "textarea",
    {
      ref: g,
      disabled: d,
      "aria-invalid": r || void 0,
      "data-jtextarea-size": u,
      "data-jtextarea-variant": c,
      "data-jtextarea-resize": l,
      "data-jtextarea-error": r ? "true" : void 0,
      "data-jtextarea-autoresize": o ? "true" : void 0,
      className: H(
        "jtextarea",
        "w-full rounded-md border text-neutral-900",
        "placeholder:text-neutral-400 transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        A[u],
        C[c],
        w[l],
        r ? "border-danger-500 focus-visible:ring-danger-500" : "focus-visible:ring-primary-500",
        f
      ),
      style: x,
      onChange: v,
      onFocus: p,
      onBlur: h,
      onKeyDown: b,
      ...m
    }
  );
};
export {
  V as JTextAreaView
};
//# sourceMappingURL=JTextAreaView.js.map
