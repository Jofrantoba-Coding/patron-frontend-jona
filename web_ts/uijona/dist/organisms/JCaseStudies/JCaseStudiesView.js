import { jsx as e, jsxs as d, Fragment as g } from "react/jsx-runtime";
import { cn as p } from "../../lib/cn.js";
import { JSectionHeadingImpl as u } from "../../molecules/JSectionHeading/JSectionHeadingImpl.js";
const f = ({ item: i }) => {
  const { sector: r, title: o, outcome: c, metrics: a, tags: t, href: n, linkLabel: s = "Ver caso →" } = i, m = /* @__PURE__ */ d(g, { children: [
    r && /* @__PURE__ */ e("span", { className: "inline-flex w-fit rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700", children: r }),
    /* @__PURE__ */ e("strong", { className: "text-lg font-bold leading-snug text-neutral-900", children: o }),
    /* @__PURE__ */ e("p", { className: "text-sm leading-relaxed text-neutral-500", children: c }),
    a && a.length > 0 && /* @__PURE__ */ e("div", { className: "mt-auto grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4", children: a.map((l) => /* @__PURE__ */ d("div", { className: "flex flex-col gap-0.5", children: [
      /* @__PURE__ */ e("strong", { className: "text-xl font-black leading-none text-neutral-900", children: l.value }),
      /* @__PURE__ */ e("span", { className: "text-xs leading-tight text-neutral-500", children: l.label })
    ] }, l.label)) }),
    t && t.length > 0 && /* @__PURE__ */ e("div", { className: "flex flex-wrap gap-1.5", children: t.map((l) => /* @__PURE__ */ e("span", { className: "rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600", children: l }, l)) }),
    n && /* @__PURE__ */ e("span", { className: "mt-1 text-sm font-semibold text-primary-600 group-hover:text-primary-700", children: s })
  ] }), x = "group flex min-w-0 flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-6 transition-shadow duration-200 hover:shadow-lg";
  return n ? /* @__PURE__ */ e(
    "a",
    {
      href: n,
      className: p(
        x,
        "no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
      ),
      children: m
    }
  ) : /* @__PURE__ */ e("div", { className: x, children: m });
}, v = ({
  eyebrow: i,
  heading: r,
  description: o,
  items: c,
  as: a = "section",
  className: t
}) => /* @__PURE__ */ e(a, { className: p("w-full bg-neutral-50 py-16 sm:py-20", t), children: /* @__PURE__ */ d("div", { className: "mx-auto w-full max-w-6xl px-4 sm:px-6", children: [
  /* @__PURE__ */ e(u, { eyebrow: i, heading: r, description: o, className: "mb-10" }),
  /* @__PURE__ */ e("div", { className: "grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]", children: c.map((s) => /* @__PURE__ */ e(f, { item: s }, s.title)) })
] }) });
export {
  v as JCaseStudiesView
};
//# sourceMappingURL=JCaseStudiesView.js.map
