import { jsx as r } from "react/jsx-runtime";
import o from "react";
import { cn as l } from "../../lib/cn.js";
const d = o.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ r("div", { className: "relative w-full overflow-auto rounded-md border border-neutral-200", children: /* @__PURE__ */ r("table", { ref: t, className: l("w-full caption-bottom text-sm", e), ...a }) })
);
d.displayName = "TableMolecule";
const n = o.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ r("caption", { ref: t, className: l("mt-4 text-sm text-neutral-500", e), ...a })
), c = o.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ r("thead", { ref: t, className: l("bg-neutral-50 [&_tr]:border-b", e), ...a })
), b = o.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ r("tbody", { ref: t, className: l("[&_tr:last-child]:border-0", e), ...a })
), f = o.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ r("tfoot", { ref: t, className: l("bg-neutral-50 font-medium [&>tr]:last:border-b-0", e), ...a })
), w = o.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ r("tr", { ref: t, className: l("border-b border-neutral-200 transition-colors hover:bg-neutral-50 data-[state=selected]:bg-primary-50", e), ...a })
), u = o.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ r("th", { ref: t, className: l("h-10 px-4 text-left align-middle font-medium text-neutral-500", e), ...a })
), p = o.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ r("td", { ref: t, className: l("px-4 py-3 align-middle text-neutral-900", e), ...a })
);
export {
  b as TableBodyView,
  n as TableCaptionView,
  p as TableCellView,
  f as TableFooterView,
  u as TableHeadView,
  c as TableHeaderView,
  d as TableMoleculeView,
  w as TableRowView
};
//# sourceMappingURL=TableMoleculeView.js.map
