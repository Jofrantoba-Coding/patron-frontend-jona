import { jsx as e, jsxs as h } from "react/jsx-runtime";
import { cn as t } from "../../lib/cn.js";
import { JPanelImpl as r } from "../../atoms/JPanel/JPanelImpl.js";
import { JLabelImpl as i } from "../../atoms/JLabel/JLabelImpl.js";
function p(n) {
  const a = n.variant === "outline" ? "hero-link-secondary" : "hero-link-primary";
  return n.href ? /* @__PURE__ */ e(i, { variant: n.variant === "primary" ? "link-button" : "link", href: n.href, className: a, children: n.label }, n.label) : /* @__PURE__ */ e("button", { type: "button", onClick: n.onClick, className: t("hero-link-primary", a), children: n.label }, n.label);
}
const k = ({
  eyebrow: n,
  title: a,
  subtitle: l,
  ctas: o,
  visual: s,
  metrics: d,
  className: m,
  ...c
}) => /* @__PURE__ */ e(r, { as: "section", variant: "ghost", padding: "none", radius: "none", className: t("hero-section", m), ...c, children: /* @__PURE__ */ h(r, { className: "hero-grid", variant: "ghost", padding: "none", radius: "none", children: [
  /* @__PURE__ */ h(r, { className: "hero-copy", variant: "ghost", padding: "none", radius: "none", children: [
    n && /* @__PURE__ */ e(i, { as: "span", className: "eyebrow", children: n }),
    /* @__PURE__ */ e(i, { as: "h1", className: "hero-title", children: a }),
    l && /* @__PURE__ */ e(i, { className: "hero-summary", children: l }),
    o && o.length > 0 && /* @__PURE__ */ e(r, { className: "hero-actions", variant: "ghost", padding: "none", radius: "none", children: o.map(p) }),
    d && /* @__PURE__ */ e(r, { variant: "ghost", padding: "none", radius: "none", children: d })
  ] }),
  s && /* @__PURE__ */ e(r, { variant: "ghost", padding: "none", radius: "none", children: s })
] }) });
export {
  k as JMarketingHeroView
};
//# sourceMappingURL=JMarketingHeroView.js.map
