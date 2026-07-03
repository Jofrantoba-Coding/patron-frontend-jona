import { jsx as r, jsxs as s } from "react/jsx-runtime";
import { cn as a } from "../../lib/cn.js";
const x = "inline-flex min-h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500", p = {
  primary: "bg-primary-600 text-white hover:bg-primary-700",
  outline: "border border-white/20 text-neutral-200 hover:bg-white/10"
};
function d(e) {
  const l = e.variant ?? "primary", i = a(x, p[l], "w-full sm:w-auto");
  return e.href ? /* @__PURE__ */ r("a", { href: e.href, className: i, children: e.label }, e.label) : /* @__PURE__ */ r("button", { type: "button", onClick: e.onClick, className: i, children: e.label }, e.label);
}
const h = ({
  eyebrow: e,
  titlePrefix: l,
  word: i,
  subtitle: o,
  ctas: t,
  visual: n,
  className: m,
  ...c
}) => /* @__PURE__ */ r(
  "section",
  {
    className: a("w-full bg-neutral-900 px-4 py-16 sm:px-6 sm:py-20 lg:py-28", m),
    ...c,
    children: /* @__PURE__ */ s(
      "div",
      {
        className: a(
          "mx-auto grid w-full max-w-6xl gap-10",
          n && "lg:grid-cols-2 lg:items-center lg:gap-16"
        ),
        children: [
          /* @__PURE__ */ s("div", { className: "flex min-w-0 flex-col gap-5", children: [
            e && /* @__PURE__ */ r("span", { className: "text-xs font-semibold uppercase tracking-wide text-primary-400", children: e }),
            /* @__PURE__ */ s("h1", { className: "text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl", children: [
              l,
              " ",
              /* @__PURE__ */ r("span", { "aria-live": "polite", className: "inline-block", children: /* @__PURE__ */ r("span", { className: "jhero-word bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent", children: i }, i) })
            ] }),
            o && /* @__PURE__ */ r("p", { className: "max-w-prose text-base leading-relaxed text-neutral-400 sm:text-lg", children: o }),
            t && t.length > 0 && /* @__PURE__ */ r("div", { className: "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center", children: t.map(d) })
          ] }),
          n && /* @__PURE__ */ r("div", { className: "min-w-0", children: n })
        ]
      }
    )
  }
);
export {
  h as JHeroDynamicView
};
//# sourceMappingURL=JHeroDynamicView.js.map
