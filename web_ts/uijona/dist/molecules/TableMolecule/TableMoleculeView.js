import { jsx as n, jsxs as u } from "react/jsx-runtime";
import d from "react";
import { cn as c } from "../../lib/cn.js";
import { useTableContext as v } from "./TableMoleculeContext.js";
import { PanelAtomImpl as w } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { InputAtomImpl as le } from "../../atoms/InputAtom/InputAtomImpl.js";
const ie = {
  scroll: "relative flex w-full max-w-full flex-col md:rounded-md md:border md:border-neutral-200",
  cards: "relative flex w-full max-w-full flex-col md:rounded-md md:border md:border-neutral-200",
  none: "relative flex w-full max-w-full flex-col rounded-md border border-neutral-200"
}, se = {
  scroll: "overflow-x-auto",
  cards: "",
  none: "overflow-x-auto"
}, de = d.forwardRef(
  ({
    className: e,
    wrapperClassName: r,
    responsiveMode: t = "scroll",
    pagination: a,
    style: o,
    columns: m,
    data: h,
    caption: k,
    emptyMessage: p,
    ...f
  }, s) => /* @__PURE__ */ u(w, { variant: "ghost", padding: "none", radius: "none", className: c(ie[t], r), children: [
    /* @__PURE__ */ n(w, { variant: "ghost", padding: "none", radius: "none", className: se[t], children: /* @__PURE__ */ n(
      "table",
      {
        ref: s,
        style: t !== "none" ? void 0 : o,
        className: c(
          "caption-bottom text-sm text-neutral-900",
          t === "scroll" && "w-full min-w-max",
          t === "cards" && "block w-full min-w-0 md:table",
          t === "none" && "w-full min-w-max",
          e
        ),
        ...f
      }
    ) }),
    a && /* @__PURE__ */ n(me, { ...a })
  ] })
);
de.displayName = "TableMolecule";
function ce(e, r) {
  if (r <= 9) return Array.from({ length: r }, (m, h) => h + 1);
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
      className: c(
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
function me({
  currentPage: e,
  pageSize: r,
  totalRows: t,
  pageSizeOptions: a = [10, 25, 50, 100],
  onPageChange: o,
  onPageSizeChange: m,
  showPageSizeSelector: h = !0,
  showRowsInfo: k = !0
}) {
  const p = Math.max(1, r), f = Math.max(1, Math.ceil(t / p)), s = Math.min(Math.max(e, 1), f), N = t === 0 ? 0 : Math.min((s - 1) * p + 1, t), g = Math.min(s * p, t), x = ce(s, f);
  return /* @__PURE__ */ u(w, { variant: "ghost", padding: "none", radius: "none", className: "flex flex-col gap-3 border-t border-neutral-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between", children: [
    k && /* @__PURE__ */ u("p", { className: "shrink-0 text-sm text-neutral-500", children: [
      "Mostrando",
      " ",
      /* @__PURE__ */ n("span", { className: "font-medium text-neutral-700", children: N }),
      " - ",
      /* @__PURE__ */ n("span", { className: "font-medium text-neutral-700", children: g }),
      " ",
      "de",
      " ",
      /* @__PURE__ */ n("span", { className: "font-medium text-neutral-700", children: t }),
      " ",
      "resultados"
    ] }),
    /* @__PURE__ */ u(w, { variant: "ghost", padding: "none", radius: "none", className: "flex flex-wrap items-center gap-4", children: [
      h && m && /* @__PURE__ */ u(w, { variant: "ghost", padding: "none", radius: "none", className: "flex items-center gap-2 text-sm text-neutral-600", children: [
        /* @__PURE__ */ n("span", { className: "shrink-0", children: "Filas por pagina" }),
        /* @__PURE__ */ n(
          "select",
          {
            value: r,
            onChange: (i) => {
              m(Number(i.target.value)), o(1);
            },
            className: "h-8 rounded-md border border-neutral-300 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500",
            children: a.map((i) => /* @__PURE__ */ n("option", { value: i, children: i }, i))
          }
        )
      ] }),
      /* @__PURE__ */ u("nav", { "aria-label": "Paginacion de tabla", className: "flex items-center gap-1", children: [
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
        x.map(
          (i, b) => i === "ellipsis" ? /* @__PURE__ */ n("span", { className: "select-none px-1 text-neutral-400", children: "..." }, `ellipsis-${b}`) : /* @__PURE__ */ n(
            T,
            {
              active: i === s,
              "aria-label": `Pagina ${i}`,
              "aria-current": i === s ? "page" : void 0,
              onClick: () => o(i),
              children: i
            },
            i
          )
        ),
        /* @__PURE__ */ n(
          T,
          {
            "aria-label": "Pagina siguiente",
            disabled: s === f,
            onClick: () => o(s + 1),
            children: ">"
          }
        ),
        /* @__PURE__ */ n(
          T,
          {
            "aria-label": "Ultima pagina",
            disabled: s === f,
            onClick: () => o(f),
            children: ">>"
          }
        )
      ] })
    ] })
  ] });
}
const ue = d.forwardRef(
  ({ className: e, ...r }, t) => /* @__PURE__ */ n("caption", { ref: t, className: c("mt-4 text-sm text-neutral-500", e), ...r })
);
ue.displayName = "TableCaption";
const fe = d.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = v();
    return /* @__PURE__ */ n(
      "thead",
      {
        ref: t,
        className: c(
          a === "cards" ? "hidden md:table-header-group" : "table-header-group",
          "bg-neutral-50 [&_tr]:border-b",
          e
        ),
        ...r
      }
    );
  }
);
fe.displayName = "TableHeader";
const be = d.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = v();
    return /* @__PURE__ */ n(
      "tbody",
      {
        ref: t,
        className: c(
          a === "cards" ? "block md:table-row-group" : "table-row-group",
          "[&_tr:last-child]:border-b-0",
          e
        ),
        ...r
      }
    );
  }
);
be.displayName = "TableBody";
const pe = d.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = v();
    return /* @__PURE__ */ n(
      "tfoot",
      {
        ref: t,
        className: c(
          a === "cards" ? "block md:table-footer-group" : "table-footer-group",
          "bg-neutral-50 font-medium [&>tr]:last:border-b-0",
          e
        ),
        ...r
      }
    );
  }
);
pe.displayName = "TableFooter";
const xe = d.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = v();
    return /* @__PURE__ */ n(
      "tr",
      {
        ref: t,
        className: c(
          "transition-colors hover:bg-neutral-50 data-[state=selected]:bg-primary-50",
          a === "cards" ? "mb-3 grid min-w-0 grid-cols-1 gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm md:table-row md:rounded-none md:border-0 md:border-b md:border-neutral-200 md:bg-transparent md:p-0 md:shadow-none" : "border-b border-neutral-200",
          e
        ),
        ...r
      }
    );
  }
);
xe.displayName = "TableRow";
function he(e, r) {
  const t = r.indexOf(e);
  return r[t === -1 || t === r.length - 1 ? 0 : t + 1];
}
function ge(e) {
  if (e === "asc") return "ascending";
  if (e === "desc") return "descending";
}
function S(e) {
  return typeof e == "number" ? `${e}px` : e;
}
function B(e) {
  if (typeof e == "number") return e;
  if (typeof e == "string" && e.endsWith("px")) return Number.parseFloat(e);
}
function we(e, r, t) {
  const a = r ?? 48, o = t ?? Number.POSITIVE_INFINITY;
  return Math.min(Math.max(e, a), o);
}
function ve({ direction: e }) {
  return /* @__PURE__ */ u("svg", { className: "h-3.5 w-3.5 shrink-0", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, "aria-hidden": "true", children: [
    /* @__PURE__ */ n("polyline", { points: "6 9 12 3 18 9", className: e === "asc" ? "text-primary-600" : "text-neutral-300" }),
    /* @__PURE__ */ n("polyline", { points: "6 15 12 21 18 15", className: e === "desc" ? "text-primary-600" : "text-neutral-300" })
  ] });
}
function Ne(e, r) {
  if (typeof e == "function") {
    e(r);
    return;
  }
  e && (e.current = r);
}
const ye = d.forwardRef(
  ({
    children: e,
    className: r,
    style: t,
    columnIndex: a,
    colSpan: o,
    scope: m,
    groupHeader: h = !1,
    sortable: k = !1,
    sortDirection: p = null,
    sortLabel: f,
    sortCycle: s = ["asc", "desc", null],
    onSortChange: N,
    filterable: g = !1,
    filterValue: x,
    filterPlaceholder: i = "Filtrar...",
    filterInputProps: b,
    onFilterChange: W,
    resizable: j = !1,
    width: y,
    minWidth: R,
    maxWidth: H,
    resizeHandleLabel: Y = "Redimensionar columna",
    onColumnResize: V,
    onClick: q,
    ...A
  }, J) => {
    const { columnFilters: K, setColumnFilter: E } = v(), L = d.useRef(null), [P, Q] = d.useState(""), [Z, C] = d.useState(() => B(y)), O = Z ?? B(y), I = S(O ?? y), M = h || m === "colgroup" || Number(o ?? 1) > 1, _ = k && !M, z = x ?? (a !== void 0 ? K[a] ?? "" : P), { onBlur: X, className: ee, ...te } = b ?? {};
    d.useEffect(() => {
      const l = B(y);
      l !== void 0 && C(l);
    }, [y]), d.useEffect(() => {
      x !== void 0 && a !== void 0 && E(a, x);
    }, [a, x, E]);
    const re = (l) => {
      l.stopPropagation(), N == null || N(he(p, s));
    }, ae = (l) => {
      var G;
      l.preventDefault(), l.stopPropagation();
      const F = l.clientX, ne = ((G = L.current) == null ? void 0 : G.offsetWidth) || O || R || 120, $ = (oe) => {
        const U = we(ne + oe.clientX - F, R, H);
        C(U), V == null || V(U);
      }, D = () => {
        document.removeEventListener("mousemove", $), document.removeEventListener("mouseup", D);
      };
      document.addEventListener("mousemove", $), document.addEventListener("mouseup", D);
    };
    return /* @__PURE__ */ u(
      "th",
      {
        ref: (l) => {
          L.current = l, Ne(J, l);
        },
        style: {
          ...t,
          width: I ?? (t == null ? void 0 : t.width),
          minWidth: S(R) ?? (t == null ? void 0 : t.minWidth),
          maxWidth: S(H) ?? (t == null ? void 0 : t.maxWidth)
        },
        "aria-sort": _ ? ge(p) : A["aria-sort"],
        className: c(
          "relative h-10 px-4 text-left align-middle font-medium text-neutral-500 whitespace-nowrap",
          M && "border-b border-neutral-200 bg-neutral-100 text-center text-neutral-700",
          (_ || g) && "select-none",
          j && "pr-6",
          r
        ),
        colSpan: o,
        scope: m ?? (M ? "colgroup" : void 0),
        onClick: q,
        ...A,
        children: [
          /* @__PURE__ */ u(
            w,
            {
              variant: "ghost",
              padding: "none",
              radius: "none",
              className: c(
                "flex min-w-0 items-center gap-2",
                g && "flex-col items-stretch gap-1 py-2",
                M && !g && "justify-center"
              ),
              children: [
                _ ? /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "inline-flex min-w-0 items-center gap-1 rounded-sm text-left font-medium text-inherit outline-none hover:text-neutral-800 focus-visible:ring-2 focus-visible:ring-primary-500",
                    onClick: re,
                    "aria-label": f,
                    children: [
                      /* @__PURE__ */ n("span", { className: "truncate", children: e }),
                      /* @__PURE__ */ n(ve, { direction: p })
                    ]
                  }
                ) : /* @__PURE__ */ n("span", { className: "truncate", children: e }),
                g && /* @__PURE__ */ n(
                  le,
                  {
                    ...te,
                    type: (b == null ? void 0 : b.type) ?? "text",
                    value: z,
                    placeholder: i,
                    "aria-label": (b == null ? void 0 : b["aria-label"]) ?? i,
                    onClick: (l) => l.stopPropagation(),
                    onChange: (l) => {
                      x === void 0 && (a !== void 0 ? E(a, l) : Q(l)), W == null || W(l);
                    },
                    onBlur: X ? (l, F) => X(F) : void 0,
                    className: c(
                      "h-8 w-full min-w-[8rem] rounded-md border border-neutral-300 bg-white px-2 text-xs font-normal text-neutral-900 placeholder:text-neutral-400",
                      "focus:outline-none focus:ring-2 focus:ring-primary-500",
                      ee
                    )
                  }
                )
              ]
            }
          ),
          j && /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": Y,
              className: "absolute right-0 top-0 h-full w-3 cursor-col-resize touch-none border-r border-transparent outline-none hover:border-primary-400 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500",
              onMouseDown: ae
            }
          )
        ]
      }
    );
  }
);
ye.displayName = "TableHead";
const Te = d.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = v(), o = r.colSpan;
    return /* @__PURE__ */ n(
      "td",
      {
        ref: t,
        className: c(
          "break-words text-neutral-900",
          a === "cards" ? c(
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
Te.displayName = "TableCell";
export {
  be as TableBodyView,
  ue as TableCaptionView,
  Te as TableCellView,
  pe as TableFooterView,
  ye as TableHeadView,
  fe as TableHeaderView,
  de as TableMoleculeView,
  xe as TableRowView
};
//# sourceMappingURL=TableMoleculeView.js.map
