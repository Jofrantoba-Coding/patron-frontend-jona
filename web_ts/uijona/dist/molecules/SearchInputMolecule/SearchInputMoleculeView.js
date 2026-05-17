import { jsxs as r, jsx as e } from "react/jsx-runtime";
import { cn as o } from "../../lib/cn.js";
import { JPanelImpl as l } from "../../atoms/JPanel/JPanelImpl.js";
import { SpinnerAtomImpl as w } from "../../atoms/SpinnerAtom/SpinnerAtomImpl.js";
import { InputAtomImpl as N } from "../../atoms/InputAtom/InputAtomImpl.js";
const k = () => /* @__PURE__ */ r("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
  /* @__PURE__ */ e("circle", { cx: "11", cy: "11", r: "7" }),
  /* @__PURE__ */ e("path", { d: "m20 20-3.5-3.5" })
] }), I = () => /* @__PURE__ */ r("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
  /* @__PURE__ */ e("path", { d: "M18 6 6 18" }),
  /* @__PURE__ */ e("path", { d: "m6 6 12 12" })
] }), M = ({
  inputValue: i,
  clearable: a,
  loading: s,
  disabled: n,
  className: c,
  containerClassName: u,
  forwardedRef: m,
  onInputChange: d,
  onInputBlur: h,
  onInputKeyDown: p,
  onClearClick: f,
  onSearchClick: b,
  placeholder: v = "Search",
  "aria-label": x = "Search",
  ...g
}) => /* @__PURE__ */ r(l, { variant: "ghost", padding: "none", radius: "none", className: o("flex w-full min-w-0 items-center gap-2", u), children: [
  /* @__PURE__ */ r(l, { variant: "ghost", padding: "none", radius: "none", className: "relative min-w-0 flex-1", children: [
    /* @__PURE__ */ e("span", { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400", children: s ? /* @__PURE__ */ e(w, { size: "sm" }) : /* @__PURE__ */ e(k, {}) }),
    /* @__PURE__ */ e(
      N,
      {
        ...g,
        ref: m,
        type: "search",
        role: "searchbox",
        value: i,
        disabled: n,
        placeholder: v,
        "aria-label": x,
        onChange: (y, t) => d(t),
        onBlur: (y, t) => h(t),
        onKeyDown: p,
        className: o(
          "flex h-9 w-full min-w-0 rounded-md border border-neutral-300 bg-neutral-50 py-1 pl-9 pr-9 text-sm text-neutral-900",
          "placeholder:text-neutral-400 transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          c
        )
      }
    ),
    a && i && !n && /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        "aria-label": "Clear search",
        onClick: f,
        className: "absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        children: /* @__PURE__ */ e(I, {})
      }
    )
  ] }),
  /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      disabled: n,
      onClick: b,
      className: "inline-flex min-h-9 shrink-0 items-center justify-center rounded-md bg-primary-600 px-3 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
      children: "Search"
    }
  )
] });
export {
  M as SearchInputMoleculeView
};
//# sourceMappingURL=SearchInputMoleculeView.js.map
