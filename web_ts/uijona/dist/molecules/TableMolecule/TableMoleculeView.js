import { jsx as n, jsxs as b } from "react/jsx-runtime";
import c from "react";
import { cn as d } from "../../lib/cn.js";
import { useTableContext as g } from "./TableMoleculeContext.js";
const re = {
  scroll: "relative flex w-full max-w-full flex-col md:rounded-md md:border md:border-neutral-200",
  cards: "relative flex w-full max-w-full flex-col md:rounded-md md:border md:border-neutral-200",
  none: "relative flex w-full max-w-full flex-col rounded-md border border-neutral-200"
}, ae = {
  scroll: "overflow-x-auto",
  cards: "",
  none: "overflow-x-auto"
}, ne = c.forwardRef(
  ({ className: e, wrapperClassName: r, responsiveMode: t = "scroll", pagination: a, style: o, ...m }, f) => /* @__PURE__ */ b("div", { className: d(re[t], r), children: [
    /* @__PURE__ */ n("div", { className: ae[t], children: /* @__PURE__ */ n(
      "table",
      {
        ref: f,
        style: t !== "none" ? void 0 : o,
        className: d(
          "caption-bottom text-sm text-neutral-900",
          t === "scroll" && "w-full min-w-max",
          t === "cards" && "block w-full min-w-0 md:table",
          t === "none" && "w-full min-w-max",
          e
        ),
        ...m
      }
    ) }),
    a && /* @__PURE__ */ n(le, { ...a })
  ] })
);
ne.displayName = "TableMolecule";
function oe(e, r) {
  if (r <= 9) return Array.from({ length: r }, (m, f) => f + 1);
  const t = Math.max(2, e - 2), a = Math.min(r - 1, e + 2), o = [1];
  t > 2 && o.push("ellipsis");
  for (let m = t; m <= a; m += 1) o.push(m);
  return a < r - 1 && o.push("ellipsis"), o.push(r), o;
}
function T({
  children: e,
  active: r,
  disabled: t,
  onClick: a,
  ...o
}) {
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      disabled: t,
      onClick: a,
      className: d(
        "flex h-8 min-w-[2rem] items-center justify-center rounded-md px-2 text-sm font-medium transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        r ? "bg-primary-600 text-white" : "text-neutral-600 hover:bg-neutral-100",
        t && "pointer-events-none opacity-40"
      ),
      ...o,
      children: e
    }
  );
}
function le({
  currentPage: e,
  pageSize: r,
  totalRows: t,
  pageSizeOptions: a = [10, 25, 50, 100],
  onPageChange: o,
  onPageSizeChange: m,
  showPageSizeSelector: f = !0,
  showRowsInfo: M = !0
}) {
  const p = Math.max(1, r), x = Math.max(1, Math.ceil(t / p)), s = Math.min(Math.max(e, 1), x), v = t === 0 ? 0 : Math.min((s - 1) * p + 1, t), w = Math.min(s * p, t), h = oe(s, x);
  return /* @__PURE__ */ b("div", { className: "flex flex-col gap-3 border-t border-neutral-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between", children: [
    M && /* @__PURE__ */ b("p", { className: "shrink-0 text-sm text-neutral-500", children: [
      "Mostrando",
      " ",
      /* @__PURE__ */ n("span", { className: "font-medium text-neutral-700", children: v }),
      " - ",
      /* @__PURE__ */ n("span", { className: "font-medium text-neutral-700", children: w }),
      " ",
      "de",
      " ",
      /* @__PURE__ */ n("span", { className: "font-medium text-neutral-700", children: t }),
      " ",
      "resultados"
    ] }),
    /* @__PURE__ */ b("div", { className: "flex flex-wrap items-center gap-4", children: [
      f && m && /* @__PURE__ */ b("div", { className: "flex items-center gap-2 text-sm text-neutral-600", children: [
        /* @__PURE__ */ n("span", { className: "shrink-0", children: "Filas por pagina" }),
        /* @__PURE__ */ n(
          "select",
          {
            value: r,
            onChange: (l) => {
              m(Number(l.target.value)), o(1);
            },
            className: "h-8 rounded-md border border-neutral-300 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500",
            children: a.map((l) => /* @__PURE__ */ n("option", { value: l, children: l }, l))
          }
        )
      ] }),
      /* @__PURE__ */ b("nav", { "aria-label": "Paginacion de tabla", className: "flex items-center gap-1", children: [
        /* @__PURE__ */ n(
          T,
          {
            "aria-label": "Primera pagina",
            disabled: s === 1,
            onClick: () => o(1),
            children: "<<"
          }
        ),
        /* @__PURE__ */ n(
          T,
          {
            "aria-label": "Pagina anterior",
            disabled: s === 1,
            onClick: () => o(s - 1),
            children: "<"
          }
        ),
        h.map(
          (l, u) => l === "ellipsis" ? /* @__PURE__ */ n("span", { className: "select-none px-1 text-neutral-400", children: "..." }, `ellipsis-${u}`) : /* @__PURE__ */ n(
            T,
            {
              active: l === s,
              "aria-label": `Pagina ${l}`,
              "aria-current": l === s ? "page" : void 0,
              onClick: () => o(l),
              children: l
            },
            l
          )
        ),
        /* @__PURE__ */ n(
          T,
          {
            "aria-label": "Pagina siguiente",
            disabled: s === x,
            onClick: () => o(s + 1),
            children: ">"
          }
        ),
        /* @__PURE__ */ n(
          T,
          {
            "aria-label": "Ultima pagina",
            disabled: s === x,
            onClick: () => o(x),
            children: ">>"
          }
        )
      ] })
    ] })
  ] });
}
const ie = c.forwardRef(
  ({ className: e, ...r }, t) => /* @__PURE__ */ n("caption", { ref: t, className: d("mt-4 text-sm text-neutral-500", e), ...r })
);
ie.displayName = "TableCaption";
const se = c.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = g();
    return /* @__PURE__ */ n(
      "thead",
      {
        ref: t,
        className: d(
          a === "cards" ? "hidden md:table-header-group" : "table-header-group",
          "bg-neutral-50 [&_tr]:border-b",
          e
        ),
        ...r
      }
    );
  }
);
se.displayName = "TableHeader";
const ce = c.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = g();
    return /* @__PURE__ */ n(
      "tbody",
      {
        ref: t,
        className: d(
          a === "cards" ? "block md:table-row-group" : "table-row-group",
          "[&_tr:last-child]:border-b-0",
          e
        ),
        ...r
      }
    );
  }
);
ce.displayName = "TableBody";
const de = c.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = g();
    return /* @__PURE__ */ n(
      "tfoot",
      {
        ref: t,
        className: d(
          a === "cards" ? "block md:table-footer-group" : "table-footer-group",
          "bg-neutral-50 font-medium [&>tr]:last:border-b-0",
          e
        ),
        ...r
      }
    );
  }
);
de.displayName = "TableFooter";
const me = c.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = g();
    return /* @__PURE__ */ n(
      "tr",
      {
        ref: t,
        className: d(
          "transition-colors hover:bg-neutral-50 data-[state=selected]:bg-primary-50",
          a === "cards" ? "mb-3 grid min-w-0 grid-cols-1 gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm md:table-row md:rounded-none md:border-0 md:border-b md:border-neutral-200 md:bg-transparent md:p-0 md:shadow-none" : "border-b border-neutral-200",
          e
        ),
        ...r
      }
    );
  }
);
me.displayName = "TableRow";
function ue(e, r) {
  const t = r.indexOf(e);
  return r[t === -1 || t === r.length - 1 ? 0 : t + 1];
}
function be(e) {
  if (e === "asc") return "ascending";
  if (e === "desc") return "descending";
}
function F(e) {
  return typeof e == "number" ? `${e}px` : e;
}
function j(e) {
  if (typeof e == "number") return e;
  if (typeof e == "string" && e.endsWith("px")) return Number.parseFloat(e);
}
function fe(e, r, t) {
  const a = r ?? 48, o = t ?? Number.POSITIVE_INFINITY;
  return Math.min(Math.max(e, a), o);
}
function pe({ direction: e }) {
  return /* @__PURE__ */ b("svg", { className: "h-3.5 w-3.5 shrink-0", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, "aria-hidden": "true", children: [
    /* @__PURE__ */ n("polyline", { points: "6 9 12 3 18 9", className: e === "asc" ? "text-primary-600" : "text-neutral-300" }),
    /* @__PURE__ */ n("polyline", { points: "6 15 12 21 18 15", className: e === "desc" ? "text-primary-600" : "text-neutral-300" })
  ] });
}
function xe(e, r) {
  if (typeof e == "function") {
    e(r);
    return;
  }
  e && (e.current = r);
}
const he = c.forwardRef(
  ({
    children: e,
    className: r,
    style: t,
    columnIndex: a,
    colSpan: o,
    scope: m,
    groupHeader: f = !1,
    sortable: M = !1,
    sortDirection: p = null,
    sortLabel: x,
    sortCycle: s = ["asc", "desc", null],
    onSortChange: v,
    filterable: w = !1,
    filterValue: h,
    filterPlaceholder: l = "Filtrar...",
    filterInputProps: u,
    onFilterChange: W,
    resizable: H = !1,
    width: N,
    minWidth: R,
    maxWidth: B,
    resizeHandleLabel: G = "Redimensionar columna",
    onColumnResize: V,
    onClick: U,
    ...L
  }, Y) => {
    const { columnFilters: q, setColumnFilter: E } = g(), _ = c.useRef(null), [J, K] = c.useState(""), [Q, X] = c.useState(() => j(N)), $ = Q ?? j(N), Z = F($ ?? N), k = f || m === "colgroup" || Number(o ?? 1) > 1, S = M && !k, z = h ?? (a !== void 0 ? q[a] ?? "" : J);
    c.useEffect(() => {
      const i = j(N);
      i !== void 0 && X(i);
    }, [N]), c.useEffect(() => {
      h !== void 0 && a !== void 0 && E(a, h);
    }, [a, h, E]);
    const P = (i) => {
      i.stopPropagation(), v == null || v(ue(p, s));
    }, I = (i) => {
      var O;
      i.preventDefault(), i.stopPropagation();
      const y = i.clientX, ee = ((O = _.current) == null ? void 0 : O.offsetWidth) || $ || R || 120, A = (te) => {
        const D = fe(ee + te.clientX - y, R, B);
        X(D), V == null || V(D);
      }, C = () => {
        document.removeEventListener("mousemove", A), document.removeEventListener("mouseup", C);
      };
      document.addEventListener("mousemove", A), document.addEventListener("mouseup", C);
    };
    return /* @__PURE__ */ b(
      "th",
      {
        ref: (i) => {
          _.current = i, xe(Y, i);
        },
        style: {
          ...t,
          width: Z ?? (t == null ? void 0 : t.width),
          minWidth: F(R) ?? (t == null ? void 0 : t.minWidth),
          maxWidth: F(B) ?? (t == null ? void 0 : t.maxWidth)
        },
        "aria-sort": S ? be(p) : L["aria-sort"],
        className: d(
          "relative h-10 px-4 text-left align-middle font-medium text-neutral-500 whitespace-nowrap",
          k && "border-b border-neutral-200 bg-neutral-100 text-center text-neutral-700",
          (S || w) && "select-none",
          H && "pr-6",
          r
        ),
        colSpan: o,
        scope: m ?? (k ? "colgroup" : void 0),
        onClick: U,
        ...L,
        children: [
          /* @__PURE__ */ b(
            "div",
            {
              className: d(
                "flex min-w-0 items-center gap-2",
                w && "flex-col items-stretch gap-1 py-2",
                k && !w && "justify-center"
              ),
              children: [
                S ? /* @__PURE__ */ b(
                  "button",
                  {
                    type: "button",
                    className: "inline-flex min-w-0 items-center gap-1 rounded-sm text-left font-medium text-inherit outline-none hover:text-neutral-800 focus-visible:ring-2 focus-visible:ring-primary-500",
                    onClick: P,
                    "aria-label": x,
                    children: [
                      /* @__PURE__ */ n("span", { className: "truncate", children: e }),
                      /* @__PURE__ */ n(pe, { direction: p })
                    ]
                  }
                ) : /* @__PURE__ */ n("span", { className: "truncate", children: e }),
                w && /* @__PURE__ */ n(
                  "input",
                  {
                    ...u,
                    type: (u == null ? void 0 : u.type) ?? "text",
                    value: z,
                    placeholder: l,
                    "aria-label": (u == null ? void 0 : u["aria-label"]) ?? l,
                    onClick: (i) => i.stopPropagation(),
                    onChange: (i) => {
                      const y = i.target.value;
                      h === void 0 && (a !== void 0 ? E(a, y) : K(y)), W == null || W(y);
                    },
                    className: d(
                      "h-8 w-full min-w-[8rem] rounded-md border border-neutral-300 bg-white px-2 text-xs font-normal text-neutral-900 placeholder:text-neutral-400",
                      "focus:outline-none focus:ring-2 focus:ring-primary-500",
                      u == null ? void 0 : u.className
                    )
                  }
                )
              ]
            }
          ),
          H && /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": G,
              className: "absolute right-0 top-0 h-full w-3 cursor-col-resize touch-none border-r border-transparent outline-none hover:border-primary-400 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500",
              onMouseDown: I
            }
          )
        ]
      }
    );
  }
);
he.displayName = "TableHead";
const we = c.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = g(), o = r.colSpan;
    return /* @__PURE__ */ n(
      "td",
      {
        ref: t,
        className: d(
          "break-words text-neutral-900",
          a === "cards" ? d(
            "flex min-w-0 flex-col gap-1 text-sm md:table-cell md:px-4 md:py-3 md:align-middle",
            "before:break-words before:text-[10px] before:font-semibold before:uppercase before:tracking-wide before:text-neutral-400",
            "before:content-[attr(data-label)] md:before:content-none",
            o && o > 1 && "md:text-center"
          ) : "px-4 py-3 align-middle",
          e
        ),
        ...r
      }
    );
  }
);
we.displayName = "TableCell";
export {
  ce as TableBodyView,
  ie as TableCaptionView,
  we as TableCellView,
  de as TableFooterView,
  he as TableHeadView,
  se as TableHeaderView,
  ne as TableMoleculeView,
  me as TableRowView
};
//# sourceMappingURL=TableMoleculeView.js.map
