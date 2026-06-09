import { jsxs as t, jsx as o } from "react/jsx-runtime";
import { cn as l } from "../../lib/cn.js";
import { JPanelImpl as r } from "../../atoms/JPanel/JPanelImpl.js";
import { JLabelImpl as a } from "../../atoms/JLabel/JLabelImpl.js";
const c = ({
  copyright: n,
  links: i,
  className: s
}) => /* @__PURE__ */ t(
  r,
  {
    as: "footer",
    variant: "ghost",
    padding: "none",
    radius: "none",
    className: l("site-footer", s),
    children: [
      /* @__PURE__ */ o(a, { as: "span", children: n }),
      /* @__PURE__ */ o(r, { variant: "ghost", padding: "none", radius: "none", className: "site-footer-links", children: i.map((e) => /* @__PURE__ */ o(a, { variant: "link", href: e.href, className: "footer-link", children: e.label }, e.href)) })
    ]
  }
);
export {
  c as JSiteFooterView
};
//# sourceMappingURL=JSiteFooterView.js.map
