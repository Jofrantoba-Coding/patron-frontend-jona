import { jsx as t } from "react/jsx-runtime";
import { cn as o } from "../../lib/cn.js";
import { PanelAtomImpl as s } from "../../atoms/PanelAtom/PanelAtomImpl.js";
const m = ({ className: e, children: a, ...n }) => /* @__PURE__ */ t(s, { variant: "ghost", padding: "none", radius: "none", className: o("min-w-0 rounded-lg border border-neutral-200 bg-white shadow-sm", e), ...n, children: a }), p = ({ className: e, children: a, ...n }) => /* @__PURE__ */ t(s, { variant: "ghost", padding: "none", radius: "none", className: o("flex min-w-0 flex-col gap-1.5 p-4 sm:p-6", e), ...n, children: a }), l = ({ className: e, children: a, ...n }) => /* @__PURE__ */ t("h3", { className: o("break-words text-lg font-semibold leading-tight text-neutral-900", e), ...n, children: a }), c = ({ className: e, children: a, ...n }) => /* @__PURE__ */ t("p", { className: o("break-words text-sm text-neutral-500", e), ...n, children: a }), g = ({ className: e, children: a, ...n }) => /* @__PURE__ */ t(s, { variant: "ghost", padding: "none", radius: "none", className: o("min-w-0 p-4 pt-0 sm:p-6 sm:pt-0", e), ...n, children: a }), w = ({ className: e, children: a, ...n }) => /* @__PURE__ */ t(s, { variant: "ghost", padding: "none", radius: "none", className: o("flex min-w-0 flex-wrap items-center gap-2 p-4 pt-0 sm:p-6 sm:pt-0", e), ...n, children: a });
export {
  g as CardContentView,
  c as CardDescriptionView,
  w as CardFooterView,
  p as CardHeaderView,
  m as CardMoleculeView,
  l as CardTitleView
};
//# sourceMappingURL=CardMoleculeView.js.map
