import { jsx as a } from "react/jsx-runtime";
import o from "react";
import { cn as d } from "../../lib/cn.js";
const l = o.forwardRef(
  ({ className: e, ...t }, r) => /* @__PURE__ */ a("div", { className: "relative w-full md:overflow-auto md:rounded-md md:border md:border-neutral-200", children: /* @__PURE__ */ a(
    "table",
    {
      ref: r,
      className: d("block w-full caption-bottom text-sm md:table md:min-w-max", e),
      ...t
    }
  ) })
);
l.displayName = "TableMolecule";
const s = o.forwardRef(
  ({ className: e, ...t }, r) => /* @__PURE__ */ a("caption", { ref: r, className: d("mt-4 text-sm text-neutral-500", e), ...t })
), c = o.forwardRef(
  ({ className: e, ...t }, r) => /* @__PURE__ */ a(
    "thead",
    {
      ref: r,
      className: d("hidden md:table-header-group bg-neutral-50 [&_tr]:border-b", e),
      ...t
    }
  )
), f = o.forwardRef(
  ({ className: e, ...t }, r) => /* @__PURE__ */ a(
    "tbody",
    {
      ref: r,
      className: d(
        "block md:table-row-group",
        "md:[&_tr:last-child]:border-b-0",
        e
      ),
      ...t
    }
  )
), i = o.forwardRef(
  ({ className: e, ...t }, r) => /* @__PURE__ */ a(
    "tfoot",
    {
      ref: r,
      className: d("block md:table-footer-group bg-neutral-50 font-medium md:[&>tr]:last:border-b-0", e),
      ...t
    }
  )
), w = o.forwardRef(
  ({ className: e, ...t }, r) => /* @__PURE__ */ a(
    "tr",
    {
      ref: r,
      className: d(
        // Mobile: card con grid de 2 columnas
        "grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border border-neutral-200 bg-white p-4 mb-3 shadow-sm",
        // Desktop: fila de tabla estándar
        "md:table-row md:rounded-none md:border-0 md:border-b md:border-neutral-200 md:bg-transparent md:p-0 md:mb-0 md:shadow-none",
        // Shared
        "transition-colors hover:bg-neutral-50 data-[state=selected]:bg-primary-50",
        e
      ),
      ...t
    }
  )
), p = o.forwardRef(
  ({ className: e, ...t }, r) => /* @__PURE__ */ a(
    "th",
    {
      ref: r,
      className: d("h-10 px-4 text-left align-middle font-medium text-neutral-500", e),
      ...t
    }
  )
), u = o.forwardRef(
  ({ className: e, ...t }, r) => /* @__PURE__ */ a(
    "td",
    {
      ref: r,
      className: d(
        // Mobile: flex columna con etiqueta superior via ::before
        "flex flex-col gap-0.5 text-sm",
        "before:content-[attr(data-label)] before:text-[10px] before:font-semibold before:uppercase before:tracking-widest before:text-neutral-400",
        // Desktop: celda normal, se elimina el ::before
        "md:table-cell md:before:content-none md:px-4 md:py-3 md:align-middle",
        "text-neutral-900",
        e
      ),
      ...t
    }
  )
);
export {
  f as TableBodyView,
  s as TableCaptionView,
  u as TableCellView,
  i as TableFooterView,
  p as TableHeadView,
  c as TableHeaderView,
  l as TableMoleculeView,
  w as TableRowView
};
//# sourceMappingURL=TableMoleculeView.js.map
