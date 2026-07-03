import { jsx as e, jsxs as r } from "react/jsx-runtime";
import { cn as t } from "../../lib/cn.js";
const s = "inline-flex min-h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500", h = ({
  title: a,
  body: n,
  primaryHref: m,
  primaryLabel: o,
  secondaryHref: l,
  secondaryLabel: i,
  as: c = "section",
  className: x
}) => /* @__PURE__ */ e(c, { className: t("w-full bg-neutral-900 py-16 sm:py-20", x), children: /* @__PURE__ */ e("div", { className: "mx-auto w-full max-w-4xl px-4 sm:px-6", children: /* @__PURE__ */ r("div", { className: "flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 text-center sm:p-12", children: [
  /* @__PURE__ */ e("h2", { className: "text-2xl font-black tracking-tight text-white sm:text-3xl", children: a }),
  /* @__PURE__ */ e("p", { className: "max-w-prose text-base leading-relaxed text-neutral-400", children: n }),
  /* @__PURE__ */ r("div", { className: "mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center", children: [
    /* @__PURE__ */ e(
      "a",
      {
        href: m,
        className: t(s, "bg-primary-600 text-white hover:bg-primary-700", "w-full sm:w-auto"),
        children: o
      }
    ),
    l && i && /* @__PURE__ */ e(
      "a",
      {
        href: l,
        className: t(s, "border border-white/20 text-neutral-200 hover:bg-white/10", "w-full sm:w-auto"),
        children: i
      }
    )
  ] })
] }) }) });
export {
  h as JDetailCTAView
};
//# sourceMappingURL=JDetailCTAView.js.map
