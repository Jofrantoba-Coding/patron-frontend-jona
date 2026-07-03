import { jsx as e, jsxs as s } from "react/jsx-runtime";
import { cn as i } from "../../lib/cn.js";
const a = "inline-flex min-h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500", g = ({
  backHref: m,
  backLabel: c,
  eyebrow: t,
  title: o,
  outcome: x,
  primaryHref: f,
  primaryLabel: d,
  secondaryHref: r,
  secondaryLabel: n,
  visual: l,
  className: h
}) => /* @__PURE__ */ e("section", { className: i("w-full bg-neutral-900 py-14 sm:py-16", h), children: /* @__PURE__ */ s(
  "div",
  {
    className: i(
      "mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6",
      l && "md:grid-cols-[1fr_auto] md:items-center md:gap-12"
    ),
    children: [
      /* @__PURE__ */ e(
        "a",
        {
          href: m,
          className: "inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-neutral-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 md:col-span-full",
          children: c
        }
      ),
      /* @__PURE__ */ s("div", { className: "min-w-0 max-w-2xl", children: [
        t != null && (typeof t == "string" ? /* @__PURE__ */ e("span", { className: "text-xs font-semibold uppercase tracking-wide text-primary-400", children: t }) : t),
        /* @__PURE__ */ e("h1", { className: "mt-2 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl", children: o }),
        /* @__PURE__ */ e("p", { className: "mt-4 max-w-xl text-base leading-relaxed text-neutral-400", children: x }),
        /* @__PURE__ */ s("div", { className: "mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center", children: [
          /* @__PURE__ */ e(
            "a",
            {
              href: f,
              className: i(a, "bg-primary-600 text-white hover:bg-primary-700", "w-full sm:w-auto"),
              children: d
            }
          ),
          r && n && /* @__PURE__ */ e(
            "a",
            {
              href: r,
              className: i(a, "border border-white/20 text-neutral-200 hover:bg-white/10", "w-full sm:w-auto"),
              children: n
            }
          )
        ] })
      ] }),
      l && /* @__PURE__ */ e("div", { className: "min-w-0", children: l })
    ]
  }
) });
export {
  g as JDetailHeroView
};
//# sourceMappingURL=JDetailHeroView.js.map
