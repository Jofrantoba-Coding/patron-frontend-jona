import { jsx as n } from "react/jsx-runtime";
import { cn as o } from "../../lib/cn.js";
import { JPanelImpl as s } from "../../atoms/JPanel/JPanelImpl.js";
import { TextAtomImpl as r } from "../../atoms/TextAtom/TextAtomImpl.js";
const l = ({ className: e, children: a, ...t }) => /* @__PURE__ */ n(s, { variant: "ghost", padding: "none", radius: "none", className: o("min-w-0 rounded-lg border border-neutral-200 bg-white shadow-sm", e), ...t, children: a }), c = ({ className: e, children: a, ...t }) => /* @__PURE__ */ n(s, { variant: "ghost", padding: "none", radius: "none", className: o("flex min-w-0 flex-col gap-1.5 p-4 sm:p-6", e), ...t, children: a }), g = ({ className: e, children: a, ...t }) => /* @__PURE__ */ n(r, { as: "h3", className: o("break-words text-lg font-semibold leading-tight text-neutral-900", e), ...t, children: a }), w = ({ className: e, children: a, ...t }) => /* @__PURE__ */ n(r, { className: o("break-words text-sm text-neutral-500", e), ...t, children: a }), x = ({ className: e, children: a, ...t }) => /* @__PURE__ */ n(s, { variant: "ghost", padding: "none", radius: "none", className: o("min-w-0 p-4 pt-0 sm:p-6 sm:pt-0", e), ...t, children: a }), f = ({ className: e, children: a, ...t }) => /* @__PURE__ */ n(s, { variant: "ghost", padding: "none", radius: "none", className: o("flex min-w-0 flex-wrap items-center gap-2 p-4 pt-0 sm:p-6 sm:pt-0", e), ...t, children: a });
export {
  x as CardContentView,
  w as CardDescriptionView,
  f as CardFooterView,
  c as CardHeaderView,
  l as CardMoleculeView,
  g as CardTitleView
};
//# sourceMappingURL=CardMoleculeView.js.map
