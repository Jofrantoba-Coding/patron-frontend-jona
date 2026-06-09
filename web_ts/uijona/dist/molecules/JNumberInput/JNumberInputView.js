import { jsxs as i, jsx as e } from "react/jsx-runtime";
import { cn as f } from "../../lib/cn.js";
import { JPanelImpl as x } from "../../atoms/JPanel/JPanelImpl.js";
import { JTextBoxImpl as v } from "../../atoms/JTextBox/JTextBoxImpl.js";
const g = () => /* @__PURE__ */ e("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: /* @__PURE__ */ e("path", { d: "M5 12h14" }) }), w = () => /* @__PURE__ */ i("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
  /* @__PURE__ */ e("path", { d: "M12 5v14" }),
  /* @__PURE__ */ e("path", { d: "M5 12h14" })
] }), C = ({
  displayValue: o,
  canDecrement: l,
  canIncrement: s,
  hasError: t,
  disabled: n,
  className: a,
  forwardedRef: d,
  onInputChange: c,
  onInputBlur: u,
  onDecrementClick: b,
  onIncrementClick: m,
  ...h
}) => /* @__PURE__ */ i(x, { variant: "ghost", padding: "none", radius: "none", className: f("inline-flex max-w-full min-w-0 items-stretch rounded-md border bg-white", t ? "border-danger-500" : "border-neutral-300", a), children: [
  /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      "aria-label": "Decrement",
      disabled: n || !l,
      onClick: b,
      className: "inline-flex min-h-9 w-9 shrink-0 items-center justify-center border-r border-neutral-200 text-neutral-600 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-40",
      children: /* @__PURE__ */ e(g, {})
    }
  ),
  /* @__PURE__ */ e(
    v,
    {
      ...h,
      ref: d,
      type: "number",
      value: o,
      disabled: n,
      hasError: t,
      onChange: (p, r) => c(r),
      onBlur: (p, r) => u(r),
      className: "h-9 min-w-0 flex-1 rounded-none border-0 bg-neutral-50 px-3 py-1 text-center text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
    }
  ),
  /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      "aria-label": "Increment",
      disabled: n || !s,
      onClick: m,
      className: "inline-flex min-h-9 w-9 shrink-0 items-center justify-center border-l border-neutral-200 text-neutral-600 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-40",
      children: /* @__PURE__ */ e(w, {})
    }
  )
] });
export {
  C as JNumberInputView
};
//# sourceMappingURL=JNumberInputView.js.map
