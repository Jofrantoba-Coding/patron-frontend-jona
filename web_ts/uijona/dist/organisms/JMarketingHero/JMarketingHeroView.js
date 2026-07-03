import { jsx as l, jsxs as o } from "react/jsx-runtime";
import { cn as s } from "../../lib/cn.js";
const x = "inline-flex min-h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500", d = {
  primary: "bg-primary-600 text-white hover:bg-primary-700",
  outline: "border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-100"
};
function p(e) {
  const t = e.variant ?? "primary", r = s(x, d[t], "w-full sm:w-auto");
  return e.href ? /* @__PURE__ */ l("a", { href: e.href, className: r, children: e.label }, e.label) : /* @__PURE__ */ l("button", { type: "button", onClick: e.onClick, className: r, children: e.label }, e.label);
}
const h = ({
  eyebrow: e,
  title: t,
  subtitle: r,
  ctas: i,
  visual: n,
  metrics: a,
  className: m,
  ...c
}) => /* @__PURE__ */ l(
  "section",
  {
    className: s("w-full px-4 py-16 sm:px-6 sm:py-20 lg:py-24", m),
    ...c,
    children: /* @__PURE__ */ o(
      "div",
      {
        className: s(
          "mx-auto grid w-full max-w-6xl gap-10",
          // Apila en móvil; dos columnas desde lg
          n && "lg:grid-cols-2 lg:items-center lg:gap-16"
        ),
        children: [
          /* @__PURE__ */ o("div", { className: "flex min-w-0 flex-col gap-5", children: [
            e && /* @__PURE__ */ l("span", { className: "text-xs font-semibold uppercase tracking-wide text-primary-600", children: e }),
            /* @__PURE__ */ l("h1", { className: "text-3xl font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl", children: t }),
            r && /* @__PURE__ */ l("p", { className: "max-w-prose text-base leading-relaxed text-neutral-600 sm:text-lg", children: r }),
            i && i.length > 0 && /* @__PURE__ */ l("div", { className: "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center", children: i.map(p) }),
            a && /* @__PURE__ */ l("div", { className: "mt-2", children: a })
          ] }),
          n && /* @__PURE__ */ l("div", { className: "min-w-0", children: n })
        ]
      }
    )
  }
);
export {
  h as JMarketingHeroView
};
//# sourceMappingURL=JMarketingHeroView.js.map
