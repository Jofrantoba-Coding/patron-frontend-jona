import { jsxs as r, jsx as e } from "react/jsx-runtime";
import { cn as m } from "../../lib/cn.js";
const p = () => /* @__PURE__ */ e("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: /* @__PURE__ */ e("path", { d: "M5 12h14" }) }), v = () => /* @__PURE__ */ r("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
  /* @__PURE__ */ e("path", { d: "M12 5v14" }),
  /* @__PURE__ */ e("path", { d: "M5 12h14" })
] }), g = ({
  displayValue: t,
  canDecrement: l,
  canIncrement: o,
  hasError: i,
  disabled: n,
  className: s,
  forwardedRef: a,
  onInputChange: c,
  onInputBlur: d,
  onDecrementClick: u,
  onIncrementClick: b,
  ...h
}) => /* @__PURE__ */ r("div", { className: m("inline-flex max-w-full min-w-0 items-stretch rounded-md border bg-white", i ? "border-danger-500" : "border-neutral-300", s), children: [
  /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      "aria-label": "Decrement",
      disabled: n || !l,
      onClick: u,
      className: "inline-flex min-h-9 w-9 shrink-0 items-center justify-center border-r border-neutral-200 text-neutral-600 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-40",
      children: /* @__PURE__ */ e(p, {})
    }
  ),
  /* @__PURE__ */ e(
    "input",
    {
      ...h,
      ref: a,
      type: "number",
      value: t,
      disabled: n,
      "aria-invalid": i || void 0,
      onChange: c,
      onBlur: d,
      className: "h-9 min-w-0 flex-1 bg-neutral-50 px-3 py-1 text-center text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    }
  ),
  /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      "aria-label": "Increment",
      disabled: n || !o,
      onClick: b,
      className: "inline-flex min-h-9 w-9 shrink-0 items-center justify-center border-l border-neutral-200 text-neutral-600 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-40",
      children: /* @__PURE__ */ e(v, {})
    }
  )
] });
export {
  g as NumberInputMoleculeView
};
//# sourceMappingURL=NumberInputMoleculeView.js.map
