import { jsx as a, jsxs as l } from "react/jsx-runtime";
import { cn as h } from "../../lib/cn.js";
import { JPanelImpl as i } from "../../atoms/JPanel/JPanelImpl.js";
import { JLabelImpl as n } from "../../atoms/JLabel/JLabelImpl.js";
const f = ({
  title: s,
  body: d,
  primaryHref: r,
  primaryLabel: c,
  secondaryHref: e,
  secondaryLabel: t,
  as: o = "section",
  className: m
}) => /* @__PURE__ */ a(
  i,
  {
    as: o,
    variant: "ghost",
    padding: "none",
    radius: "none",
    className: h("detail-section detail-cta-section", m),
    children: /* @__PURE__ */ a(i, { variant: "ghost", padding: "none", radius: "none", className: "detail-shell", children: /* @__PURE__ */ l(i, { variant: "ghost", padding: "none", radius: "none", className: "detail-cta-box", children: [
      /* @__PURE__ */ a(n, { as: "h2", className: "detail-cta-title", children: s }),
      /* @__PURE__ */ a(n, { className: "detail-cta-body", children: d }),
      /* @__PURE__ */ l(i, { variant: "ghost", padding: "none", radius: "none", className: "detail-cta-actions", children: [
        /* @__PURE__ */ a(n, { variant: "link-button", href: r, className: "detail-cta-primary", children: c }),
        e && t && /* @__PURE__ */ a(n, { variant: "link", href: e, className: "detail-cta-secondary", children: t })
      ] })
    ] }) })
  }
);
export {
  f as JDetailCTAView
};
//# sourceMappingURL=JDetailCTAView.js.map
