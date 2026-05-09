import { jsxs as r, jsx as e } from "react/jsx-runtime";
import { cn as i } from "../../lib/cn.js";
import { SpinnerAtomImpl as x } from "../../atoms/SpinnerAtom/SpinnerAtomImpl.js";
const y = () => /* @__PURE__ */ r("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
  /* @__PURE__ */ e("circle", { cx: "11", cy: "11", r: "7" }),
  /* @__PURE__ */ e("path", { d: "m20 20-3.5-3.5" })
] }), g = () => /* @__PURE__ */ r("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
  /* @__PURE__ */ e("path", { d: "M18 6 6 18" }),
  /* @__PURE__ */ e("path", { d: "m6 6 12 12" })
] }), C = ({
  inputValue: n,
  clearable: o,
  loading: l,
  disabled: t,
  className: a,
  containerClassName: s,
  forwardedRef: c,
  onInputChange: u,
  onInputBlur: m,
  onInputKeyDown: d,
  onClearClick: h,
  onSearchClick: p,
  placeholder: b = "Search",
  "aria-label": f = "Search",
  ...v
}) => /* @__PURE__ */ r("div", { className: i("flex w-full min-w-0 items-center gap-2", s), children: [
  /* @__PURE__ */ r("div", { className: "relative min-w-0 flex-1", children: [
    /* @__PURE__ */ e("span", { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400", children: l ? /* @__PURE__ */ e(x, { size: "sm" }) : /* @__PURE__ */ e(y, {}) }),
    /* @__PURE__ */ e(
      "input",
      {
        ...v,
        ref: c,
        type: "search",
        role: "searchbox",
        value: n,
        disabled: t,
        placeholder: b,
        "aria-label": f,
        onChange: u,
        onBlur: m,
        onKeyDown: d,
        className: i(
          "flex h-9 w-full min-w-0 rounded-md border border-neutral-300 bg-neutral-50 py-1 pl-9 pr-9 text-sm text-neutral-900",
          "placeholder:text-neutral-400 transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          a
        )
      }
    ),
    o && n && !t && /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        "aria-label": "Clear search",
        onClick: h,
        className: "absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        children: /* @__PURE__ */ e(g, {})
      }
    )
  ] }),
  /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      disabled: t,
      onClick: p,
      className: "inline-flex min-h-9 shrink-0 items-center justify-center rounded-md bg-primary-600 px-3 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
      children: "Search"
    }
  )
] });
export {
  C as SearchInputMoleculeView
};
//# sourceMappingURL=SearchInputMoleculeView.js.map
