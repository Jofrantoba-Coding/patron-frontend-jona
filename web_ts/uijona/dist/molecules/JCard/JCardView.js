import { jsx as t } from "react/jsx-runtime";
import { cn as s } from "../../lib/cn.js";
import { JPanelImpl as o } from "../../atoms/JPanel/JPanelImpl.js";
import { JLabelImpl as r } from "../../atoms/JLabel/JLabelImpl.js";
const l = ({ className: e, children: a, ...n }) => /* @__PURE__ */ t(o, { variant: "ghost", padding: "none", radius: "none", className: s("min-w-0 rounded-lg border border-neutral-200 bg-white shadow-sm", e), ...n, children: a }), c = ({ className: e, children: a, ...n }) => /* @__PURE__ */ t(o, { variant: "ghost", padding: "none", radius: "none", className: s("flex min-w-0 flex-col gap-1.5 p-4 sm:p-6", e), ...n, children: a }), g = ({ className: e, children: a, ...n }) => /* @__PURE__ */ t(r, { as: "h3", className: s("break-words text-lg font-semibold leading-tight text-neutral-900", e), ...n, children: a }), w = ({ className: e, children: a, ...n }) => /* @__PURE__ */ t(r, { className: s("break-words text-sm text-neutral-500", e), ...n, children: a }), x = ({ className: e, children: a, ...n }) => /* @__PURE__ */ t(o, { variant: "ghost", padding: "none", radius: "none", className: s("min-w-0 p-4 pt-0 sm:p-6 sm:pt-0", e), ...n, children: a }), f = ({ className: e, children: a, ...n }) => /* @__PURE__ */ t(o, { variant: "ghost", padding: "none", radius: "none", className: s("flex min-w-0 flex-wrap items-center gap-2 p-4 pt-0 sm:p-6 sm:pt-0", e), ...n, children: a });
export {
  x as CardContentView,
  w as CardDescriptionView,
  f as CardFooterView,
  c as CardHeaderView,
  g as CardTitleView,
  l as JCardView
};
//# sourceMappingURL=JCardView.js.map
