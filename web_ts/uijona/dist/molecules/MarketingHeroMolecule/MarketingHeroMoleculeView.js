import { jsx as e, jsxs as o } from "react/jsx-runtime";
import { cn as r } from "../../lib/cn.js";
import { SectionShellAtomImpl as x } from "../../atoms/SectionShellAtom/SectionShellAtomImpl.js";
import { EyebrowAtomImpl as g } from "../../atoms/EyebrowAtom/EyebrowAtomImpl.js";
const m = "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors duration-200", d = {
  primary: "bg-primary-600 text-white hover:bg-primary-700",
  outline: "border border-white/30 text-white hover:bg-white/10"
}, w = ({
  eyebrow: i,
  title: c,
  subtitle: n,
  ctas: t,
  visual: a,
  metrics: s,
  className: h,
  ...p
}) => /* @__PURE__ */ e(
  "section",
  {
    className: r(
      "relative overflow-hidden bg-neutral-900 py-20 sm:py-28",
      h
    ),
    ...p,
    children: /* @__PURE__ */ e(x, { children: /* @__PURE__ */ o("div", { className: "grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16", children: [
      /* @__PURE__ */ o("div", { className: "flex flex-col gap-6", children: [
        i && /* @__PURE__ */ e(g, { variant: "white", children: i }),
        /* @__PURE__ */ e("h1", { className: "text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl", children: c }),
        n && /* @__PURE__ */ e("p", { className: "text-lg leading-relaxed text-white/70 sm:text-xl", children: n }),
        t && t.length > 0 && /* @__PURE__ */ e("div", { className: "flex flex-wrap gap-3 pt-2", children: t.map((l) => l.href ? /* @__PURE__ */ e(
          "a",
          {
            href: l.href,
            className: r(m, d[l.variant ?? "primary"]),
            children: l.label
          },
          l.label
        ) : /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: l.onClick,
            className: r(m, d[l.variant ?? "primary"]),
            children: l.label
          },
          l.label
        )) }),
        s && /* @__PURE__ */ e("div", { className: "pt-2", children: s })
      ] }),
      a && /* @__PURE__ */ e("div", { className: "flex items-center justify-center lg:justify-end", children: a })
    ] }) })
  }
);
export {
  w as MarketingHeroMoleculeView
};
//# sourceMappingURL=MarketingHeroMoleculeView.js.map
