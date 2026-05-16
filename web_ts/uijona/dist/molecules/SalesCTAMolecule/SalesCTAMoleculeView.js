import { jsx as t, jsxs as n } from "react/jsx-runtime";
import { cn as r } from "../../lib/cn.js";
const g = {
  brand: "bg-primary-600",
  dark: "bg-neutral-900",
  light: "bg-neutral-50 border border-neutral-200"
}, p = {
  brand: "text-white",
  dark: "text-white",
  light: "text-neutral-900"
}, f = {
  brand: "text-white/80",
  dark: "text-white/70",
  light: "text-neutral-600"
}, d = {
  brand: "bg-white text-primary-700 hover:bg-neutral-100",
  dark: "bg-primary-600 text-white hover:bg-primary-700",
  light: "bg-primary-600 text-white hover:bg-primary-700"
}, c = {
  brand: "border border-white/40 text-white hover:bg-white/10",
  dark: "border border-white/30 text-white hover:bg-white/10",
  light: "border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
}, v = ({
  heading: x,
  description: s,
  primaryLabel: l,
  primaryHref: a,
  onPrimaryClick: m,
  secondaryLabel: i,
  secondaryHref: o,
  onSecondaryClick: h,
  tone: e = "brand",
  className: b,
  ...u
}) => /* @__PURE__ */ t(
  "div",
  {
    className: r(
      "min-w-0 rounded-2xl px-6 py-10 sm:px-10 sm:py-14",
      g[e],
      b
    ),
    ...u,
    children: /* @__PURE__ */ n("div", { className: "flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ n("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ t("h2", { className: r("text-2xl font-bold leading-tight sm:text-3xl", p[e]), children: x }),
        s && /* @__PURE__ */ t("p", { className: r("mt-2 text-base leading-relaxed", f[e]), children: s })
      ] }),
      /* @__PURE__ */ n("div", { className: "flex shrink-0 flex-wrap gap-3", children: [
        a ? /* @__PURE__ */ t(
          "a",
          {
            href: a,
            className: r(
              "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors duration-200",
              d[e]
            ),
            children: l
          }
        ) : /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            onClick: m,
            className: r(
              "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors duration-200",
              d[e]
            ),
            children: l
          }
        ),
        i && (o ? /* @__PURE__ */ t(
          "a",
          {
            href: o,
            className: r(
              "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors duration-200",
              c[e]
            ),
            children: i
          }
        ) : /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            onClick: h,
            className: r(
              "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors duration-200",
              c[e]
            ),
            children: i
          }
        ))
      ] })
    ] })
  }
);
export {
  v as SalesCTAMoleculeView
};
//# sourceMappingURL=SalesCTAMoleculeView.js.map
