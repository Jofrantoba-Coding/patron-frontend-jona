import { jsx as n } from "react/jsx-runtime";
import { cn as o } from "../../lib/cn.js";
import { PanelAtomImpl as s } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { TextAtomImpl as r } from "../../atoms/TextAtom/TextAtomImpl.js";
const l = ({ className: e, children: t, ...a }) => /* @__PURE__ */ n(s, { variant: "ghost", padding: "none", radius: "none", className: o("min-w-0 rounded-lg border border-neutral-200 bg-white shadow-sm", e), ...a, children: t }), c = ({ className: e, children: t, ...a }) => /* @__PURE__ */ n(s, { variant: "ghost", padding: "none", radius: "none", className: o("flex min-w-0 flex-col gap-1.5 p-4 sm:p-6", e), ...a, children: t }), g = ({ className: e, children: t, ...a }) => /* @__PURE__ */ n(r, { as: "h3", className: o("break-words text-lg font-semibold leading-tight text-neutral-900", e), ...a, children: t }), w = ({ className: e, children: t, ...a }) => /* @__PURE__ */ n(r, { className: o("break-words text-sm text-neutral-500", e), ...a, children: t }), x = ({ className: e, children: t, ...a }) => /* @__PURE__ */ n(s, { variant: "ghost", padding: "none", radius: "none", className: o("min-w-0 p-4 pt-0 sm:p-6 sm:pt-0", e), ...a, children: t }), f = ({ className: e, children: t, ...a }) => /* @__PURE__ */ n(s, { variant: "ghost", padding: "none", radius: "none", className: o("flex min-w-0 flex-wrap items-center gap-2 p-4 pt-0 sm:p-6 sm:pt-0", e), ...a, children: t });
export {
  x as CardContentView,
  w as CardDescriptionView,
  f as CardFooterView,
  c as CardHeaderView,
  l as CardMoleculeView,
  g as CardTitleView
};
//# sourceMappingURL=CardMoleculeView.js.map
