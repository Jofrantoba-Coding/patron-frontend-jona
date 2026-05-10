import { jsx as l } from "react/jsx-runtime";
import d from "react";
import { cn as t } from "../../lib/cn.js";
import { useTableContext as s } from "./TableMoleculeContext.js";
const m = {
  scroll: "relative w-full max-w-full overflow-x-auto rounded-md border border-neutral-200",
  cards: "relative w-full max-w-full",
  none: "relative w-full max-w-full"
}, c = d.forwardRef(
  ({ className: r, wrapperClassName: a, responsiveMode: e = "scroll", style: o, ...n }, b) => /* @__PURE__ */ l("div", { className: t(m[e], a), children: /* @__PURE__ */ l(
    "table",
    {
      ref: b,
      style: e === "cards" ? void 0 : o,
      className: t(
        "caption-bottom text-sm text-neutral-900",
        e === "scroll" && "w-full min-w-max",
        e === "cards" && "block w-full min-w-0 md:table",
        e === "none" && "w-full",
        r
      ),
      ...n
    }
  ) })
);
c.displayName = "TableMolecule";
const i = d.forwardRef(
  ({ className: r, ...a }, e) => /* @__PURE__ */ l("caption", { ref: e, className: t("mt-4 text-sm text-neutral-500", r), ...a })
);
i.displayName = "TableCaption";
const f = d.forwardRef(
  ({ className: r, ...a }, e) => {
    const { responsiveMode: o } = s();
    return /* @__PURE__ */ l(
      "thead",
      {
        ref: e,
        className: t(
          o === "cards" ? "hidden md:table-header-group" : "table-header-group",
          "bg-neutral-50 [&_tr]:border-b",
          r
        ),
        ...a
      }
    );
  }
);
f.displayName = "TableHeader";
const w = d.forwardRef(
  ({ className: r, ...a }, e) => {
    const { responsiveMode: o } = s();
    return /* @__PURE__ */ l(
      "tbody",
      {
        ref: e,
        className: t(
          o === "cards" ? "block md:table-row-group" : "table-row-group",
          "[&_tr:last-child]:border-b-0",
          r
        ),
        ...a
      }
    );
  }
);
w.displayName = "TableBody";
const p = d.forwardRef(
  ({ className: r, ...a }, e) => {
    const { responsiveMode: o } = s();
    return /* @__PURE__ */ l(
      "tfoot",
      {
        ref: e,
        className: t(
          o === "cards" ? "block md:table-footer-group" : "table-footer-group",
          "bg-neutral-50 font-medium [&>tr]:last:border-b-0",
          r
        ),
        ...a
      }
    );
  }
);
p.displayName = "TableFooter";
const u = d.forwardRef(
  ({ className: r, ...a }, e) => {
    const { responsiveMode: o } = s();
    return /* @__PURE__ */ l(
      "tr",
      {
        ref: e,
        className: t(
          "transition-colors hover:bg-neutral-50 data-[state=selected]:bg-primary-50",
          o === "cards" ? "mb-3 grid min-w-0 grid-cols-1 gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm md:table-row md:rounded-none md:border-0 md:border-b md:border-neutral-200 md:bg-transparent md:p-0 md:shadow-none" : "border-b border-neutral-200",
          r
        ),
        ...a
      }
    );
  }
);
u.displayName = "TableRow";
const x = d.forwardRef(
  ({ className: r, ...a }, e) => /* @__PURE__ */ l(
    "th",
    {
      ref: e,
      className: t(
        "h-10 px-4 text-left align-middle font-medium text-neutral-500",
        "whitespace-nowrap",
        r
      ),
      ...a
    }
  )
);
x.displayName = "TableHead";
const g = d.forwardRef(
  ({ className: r, ...a }, e) => {
    const { responsiveMode: o } = s(), n = a.colSpan;
    return /* @__PURE__ */ l(
      "td",
      {
        ref: e,
        className: t(
          "text-neutral-900",
          o === "cards" ? t(
            "flex min-w-0 flex-col gap-1 text-sm md:table-cell md:px-4 md:py-3 md:align-middle",
            "before:break-words before:text-[10px] before:font-semibold before:uppercase before:tracking-wide before:text-neutral-400",
            "before:content-[attr(data-label)] md:before:content-none",
            n && n > 1 && "md:text-center"
          ) : "px-4 py-3 align-middle",
          "break-words",
          r
        ),
        ...a
      }
    );
  }
);
g.displayName = "TableCell";
export {
  w as TableBodyView,
  i as TableCaptionView,
  g as TableCellView,
  p as TableFooterView,
  x as TableHeadView,
  f as TableHeaderView,
  c as TableMoleculeView,
  u as TableRowView
};
//# sourceMappingURL=TableMoleculeView.js.map
