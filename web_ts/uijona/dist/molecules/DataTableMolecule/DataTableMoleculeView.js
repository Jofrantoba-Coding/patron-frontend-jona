import { jsxs as a, jsx as e } from "react/jsx-runtime";
import { cn as c } from "../../lib/cn.js";
function w({ direction: l }) {
  return /* @__PURE__ */ a("svg", { className: "ml-1 inline-block h-3.5 w-3.5 shrink-0", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, "aria-hidden": "true", children: [
    /* @__PURE__ */ e("polyline", { points: "6 9 12 3 18 9", className: l === "asc" ? "text-primary-600" : "text-neutral-300" }),
    /* @__PURE__ */ e("polyline", { points: "6 15 12 21 18 15", className: l === "desc" ? "text-primary-600" : "text-neutral-300" })
  ] });
}
function H({
  columns: l,
  rows: m,
  rowKey: p,
  sort: r,
  loading: d,
  emptyTitle: y,
  emptyDescription: f,
  filterValue: v,
  filterPlaceholder: o,
  showFilter: N,
  stickyHeader: g,
  className: k,
  onSortChange: x,
  onFilterChange: s,
  onRowClick: h
}) {
  const b = (t) => {
    if (!t.sortable || !x) return;
    const i = (r == null ? void 0 : r.key) === t.key ? r.direction === "asc" ? "desc" : r.direction === "desc" ? null : "asc" : "asc";
    x({ key: t.key, direction: i });
  };
  return /* @__PURE__ */ a("div", { className: c("flex w-full flex-col gap-3", k), children: [
    N && /* @__PURE__ */ e("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ a("div", { className: "relative flex-1", children: [
      /* @__PURE__ */ a("svg", { className: "absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: [
        /* @__PURE__ */ e("circle", { cx: "11", cy: "11", r: "8" }),
        /* @__PURE__ */ e("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
      ] }),
      /* @__PURE__ */ e(
        "input",
        {
          type: "text",
          value: v,
          onChange: (t) => s == null ? void 0 : s(t.target.value),
          placeholder: o,
          "aria-label": o,
          className: "h-9 w-full rounded-md border border-neutral-300 bg-white pl-8 pr-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        }
      )
    ] }) }),
    /* @__PURE__ */ e("div", { className: "relative max-w-full overflow-auto rounded-md border border-neutral-200", children: /* @__PURE__ */ a("table", { className: "w-full min-w-max caption-bottom text-sm", children: [
      /* @__PURE__ */ e("thead", { className: c("bg-neutral-50 [&_tr]:border-b", g && "sticky top-0 z-10"), children: /* @__PURE__ */ e("tr", { children: l.map((t) => /* @__PURE__ */ e(
        "th",
        {
          style: { width: t.width },
          onClick: () => b(t),
          "aria-sort": (r == null ? void 0 : r.key) === t.key ? r.direction === "asc" ? "ascending" : r.direction === "desc" ? "descending" : void 0 : void 0,
          className: c(
            "h-10 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide text-neutral-500 select-none",
            t.align === "center" && "text-center",
            t.align === "right" && "text-right",
            t.sortable && "cursor-pointer hover:text-neutral-800"
          ),
          children: /* @__PURE__ */ a("span", { className: "inline-flex items-center", children: [
            t.header,
            t.sortable && /* @__PURE__ */ e(w, { direction: (r == null ? void 0 : r.key) === t.key ? r.direction ?? null : null })
          ] })
        },
        t.key
      )) }) }),
      /* @__PURE__ */ a("tbody", { className: "[&_tr:last-child]:border-0", children: [
        d && /* @__PURE__ */ e("tr", { children: /* @__PURE__ */ e("td", { colSpan: l.length, className: "px-4 py-12 text-center", children: /* @__PURE__ */ a("div", { className: "flex flex-col items-center gap-2 text-neutral-400", children: [
          /* @__PURE__ */ a("svg", { className: "h-6 w-6 animate-spin text-primary-500", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [
            /* @__PURE__ */ e("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
            /* @__PURE__ */ e("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
          ] }),
          /* @__PURE__ */ e("span", { className: "text-sm", children: "Cargando..." })
        ] }) }) }),
        !d && m.length === 0 && /* @__PURE__ */ e("tr", { children: /* @__PURE__ */ e("td", { colSpan: l.length, className: "px-4 py-12 text-center", children: /* @__PURE__ */ a("div", { className: "flex flex-col items-center gap-1 text-neutral-400", children: [
          /* @__PURE__ */ e("svg", { className: "h-8 w-8", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": "true", children: /* @__PURE__ */ e("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" }) }),
          /* @__PURE__ */ e("p", { className: "text-sm font-medium text-neutral-600", children: y }),
          /* @__PURE__ */ e("p", { className: "text-xs text-neutral-400", children: f })
        ] }) }) }),
        !d && m.map((t, i) => /* @__PURE__ */ e(
          "tr",
          {
            onClick: h ? () => h(t, i) : void 0,
            className: c(
              "border-b border-neutral-100 transition-colors",
              h && "cursor-pointer hover:bg-neutral-50"
            ),
            children: l.map((n) => {
              const u = t[n.key];
              return /* @__PURE__ */ e(
                "td",
                {
                  className: c(
                    "px-4 py-3 align-middle text-neutral-900",
                    n.align === "center" && "text-center",
                    n.align === "right" && "text-right"
                  ),
                  children: n.render ? n.render(u, t, i) : String(u ?? "")
                },
                n.key
              );
            })
          },
          p(t, i)
        ))
      ] })
    ] }) })
  ] });
}
export {
  H as DataTableMoleculeView
};
//# sourceMappingURL=DataTableMoleculeView.js.map
