import { jsx as t } from "react/jsx-runtime";
import { cn as a } from "../lib/cn.js";
const u = ({ className: r, ...e }) => /* @__PURE__ */ t("nav", { "aria-label": "breadcrumb", className: a("flex", r), ...e }), d = ({ className: r, ...e }) => /* @__PURE__ */ t("ol", { className: a("flex flex-wrap items-center gap-1.5 text-sm text-neutral-500", r), ...e }), p = ({ className: r, ...e }) => /* @__PURE__ */ t("li", { className: a("inline-flex items-center gap-1.5", r), ...e }), x = ({ className: r, onNavigate: e, onClick: s, children: l, href: c, ...i }) => /* @__PURE__ */ t("a", { href: c ?? "#", onClick: (n) => {
  e && (n.preventDefault(), e()), s == null || s(n);
}, className: a("transition-colors hover:text-neutral-900 cursor-pointer", r), ...i, children: l }), f = ({ className: r, ...e }) => /* @__PURE__ */ t("span", { role: "link", "aria-current": "page", "aria-disabled": "true", className: a("font-medium text-neutral-900", r), ...e }), b = ({ className: r, children: e, ...s }) => /* @__PURE__ */ t("li", { role: "presentation", "aria-hidden": "true", className: a("text-neutral-400 select-none", r), ...s, children: e ?? /* @__PURE__ */ t("svg", { className: "w-3.5 h-3.5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ t("polyline", { points: "9 18 15 12 9 6" }) }) }), h = ({ className: r, ...e }) => /* @__PURE__ */ t("span", { role: "presentation", "aria-hidden": "true", className: a("flex h-5 w-5 items-center justify-center text-neutral-400", r), ...e, children: "···" });
export {
  h as BreadcrumbEllipsis,
  p as BreadcrumbItem,
  x as BreadcrumbLink,
  d as BreadcrumbList,
  u as BreadcrumbMolecule,
  f as BreadcrumbPage,
  b as BreadcrumbSeparator
};
//# sourceMappingURL=BreadcrumbMolecule.js.map
