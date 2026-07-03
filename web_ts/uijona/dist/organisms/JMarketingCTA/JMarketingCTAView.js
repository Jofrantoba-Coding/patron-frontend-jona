import { jsx as e, jsxs as m } from "react/jsx-runtime";
import { cn as t } from "../../lib/cn.js";
const l = "inline-flex min-h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500", d = ({
  heading: u,
  description: i,
  primaryLabel: n,
  primaryHref: a,
  onPrimaryClick: x,
  secondaryLabel: r,
  secondaryHref: s,
  onSecondaryClick: o,
  className: c
}) => /* @__PURE__ */ e("section", { className: t("w-full px-4 py-16 sm:px-6 sm:py-20", c), children: /* @__PURE__ */ m("div", { className: "mx-auto flex w-full max-w-3xl flex-col items-center gap-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center sm:p-12", children: [
  /* @__PURE__ */ e("h2", { className: "text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl", children: u }),
  i && /* @__PURE__ */ e("p", { className: "max-w-prose text-base leading-relaxed text-neutral-600", children: i }),
  /* @__PURE__ */ m("div", { className: "mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center", children: [
    a ? /* @__PURE__ */ e(
      "a",
      {
        href: a,
        className: t(l, "bg-primary-600 text-white hover:bg-primary-700", "w-full sm:w-auto"),
        children: n
      }
    ) : /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        onClick: x,
        className: t(l, "bg-primary-600 text-white hover:bg-primary-700", "w-full sm:w-auto"),
        children: n
      }
    ),
    r && (s || o) && (s ? /* @__PURE__ */ e(
      "a",
      {
        href: s,
        className: t(l, "border border-neutral-300 text-neutral-900 hover:bg-neutral-100", "w-full sm:w-auto"),
        children: r
      }
    ) : /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        onClick: o,
        className: t(l, "border border-neutral-300 text-neutral-900 hover:bg-neutral-100", "w-full sm:w-auto"),
        children: r
      }
    ))
  ] })
] }) });
export {
  d as JMarketingCTAView
};
//# sourceMappingURL=JMarketingCTAView.js.map
