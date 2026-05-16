import { jsxs as c, jsx as e } from "react/jsx-runtime";
import { cn as t } from "../../lib/cn.js";
import { EyebrowAtomImpl as m } from "../../atoms/EyebrowAtom/EyebrowAtomImpl.js";
const o = {
  left: "items-start text-left",
  center: "items-center text-center"
}, d = {
  light: "text-neutral-900",
  dark: "text-white"
}, h = {
  light: "text-neutral-600",
  dark: "text-white/70"
}, w = ({
  eyebrow: l,
  heading: i,
  description: s,
  align: n = "left",
  tone: a = "light",
  eyebrowVariant: r = "primary",
  className: x
}) => /* @__PURE__ */ c("div", { className: t("flex flex-col gap-3", o[n], x), children: [
  l && /* @__PURE__ */ e(m, { variant: r, children: l }),
  /* @__PURE__ */ e("h2", { className: t("text-3xl font-bold leading-tight sm:text-4xl", d[a]), children: i }),
  s && /* @__PURE__ */ e("p", { className: t("max-w-2xl text-base leading-relaxed sm:text-lg", h[a]), children: s })
] });
export {
  w as SectionHeadingMoleculeView
};
//# sourceMappingURL=SectionHeadingMoleculeView.js.map
