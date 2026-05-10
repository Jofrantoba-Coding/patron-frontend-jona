import { jsx as n, jsxs as f } from "react/jsx-runtime";
import s from "react";
import { cn as l } from "../../lib/cn.js";
import { useTableContext as m } from "./TableMoleculeContext.js";
const Z = {
  scroll: "relative w-full max-w-full overflow-x-auto rounded-md border border-neutral-200",
  cards: "relative w-full max-w-full",
  none: "relative w-full max-w-full"
}, C = s.forwardRef(
  ({ className: e, wrapperClassName: r, responsiveMode: t = "scroll", style: a, ...c }, p) => /* @__PURE__ */ n("div", { className: l(Z[t], r), children: /* @__PURE__ */ n(
    "table",
    {
      ref: p,
      style: t === "cards" ? void 0 : a,
      className: l(
        "caption-bottom text-sm text-neutral-900",
        t === "scroll" && "w-full min-w-max",
        t === "cards" && "block w-full min-w-0 md:table",
        t === "none" && "w-full",
        e
      ),
      ...c
    }
  ) })
);
C.displayName = "TableMolecule";
const z = s.forwardRef(
  ({ className: e, ...r }, t) => /* @__PURE__ */ n("caption", { ref: t, className: l("mt-4 text-sm text-neutral-500", e), ...r })
);
z.displayName = "TableCaption";
const I = s.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = m();
    return /* @__PURE__ */ n(
      "thead",
      {
        ref: t,
        className: l(
          a === "cards" ? "hidden md:table-header-group" : "table-header-group",
          "bg-neutral-50 [&_tr]:border-b",
          e
        ),
        ...r
      }
    );
  }
);
I.displayName = "TableHeader";
const P = s.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = m();
    return /* @__PURE__ */ n(
      "tbody",
      {
        ref: t,
        className: l(
          a === "cards" ? "block md:table-row-group" : "table-row-group",
          "[&_tr:last-child]:border-b-0",
          e
        ),
        ...r
      }
    );
  }
);
P.displayName = "TableBody";
const ee = s.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = m();
    return /* @__PURE__ */ n(
      "tfoot",
      {
        ref: t,
        className: l(
          a === "cards" ? "block md:table-footer-group" : "table-footer-group",
          "bg-neutral-50 font-medium [&>tr]:last:border-b-0",
          e
        ),
        ...r
      }
    );
  }
);
ee.displayName = "TableFooter";
function te(e, r) {
  const t = r.indexOf(e);
  return r[t === -1 || t === r.length - 1 ? 0 : t + 1];
}
function re(e) {
  if (e === "asc") return "ascending";
  if (e === "desc") return "descending";
}
function y(e) {
  return typeof e == "number" ? `${e}px` : e;
}
function T(e) {
  if (typeof e == "number") return e;
  if (typeof e == "string" && e.endsWith("px")) return Number.parseFloat(e);
}
function ae(e, r, t) {
  const a = r ?? 48, c = t ?? Number.POSITIVE_INFINITY;
  return Math.min(Math.max(e, a), c);
}
function oe({ direction: e }) {
  return /* @__PURE__ */ f("svg", { className: "h-3.5 w-3.5 shrink-0", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, "aria-hidden": "true", children: [
    /* @__PURE__ */ n("polyline", { points: "6 9 12 3 18 9", className: e === "asc" ? "text-primary-600" : "text-neutral-300" }),
    /* @__PURE__ */ n("polyline", { points: "6 15 12 21 18 15", className: e === "desc" ? "text-primary-600" : "text-neutral-300" })
  ] });
}
function ne(e, r) {
  if (typeof e == "function") {
    e(r);
    return;
  }
  e && (e.current = r);
}
const le = s.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = m();
    return /* @__PURE__ */ n(
      "tr",
      {
        ref: t,
        className: l(
          "transition-colors hover:bg-neutral-50 data-[state=selected]:bg-primary-50",
          a === "cards" ? "mb-3 grid min-w-0 grid-cols-1 gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm md:table-row md:rounded-none md:border-0 md:border-b md:border-neutral-200 md:bg-transparent md:p-0 md:shadow-none" : "border-b border-neutral-200",
          e
        ),
        ...r
      }
    );
  }
);
le.displayName = "TableRow";
const se = s.forwardRef(
  ({
    children: e,
    className: r,
    style: t,
    colSpan: a,
    scope: c,
    groupHeader: p = !1,
    sortable: X = !1,
    sortDirection: x = null,
    sortLabel: _,
    sortCycle: O = ["asc", "desc", null],
    onSortChange: w,
    filterable: u = !1,
    filterValue: A = "",
    filterPlaceholder: W = "Filtrar...",
    filterInputProps: d,
    onFilterChange: g,
    resizable: k = !1,
    width: i,
    minWidth: h,
    maxWidth: R,
    resizeHandleLabel: D = "Redimensionar columna",
    onColumnResize: N,
    onClick: F,
    ...V
  }, G) => {
    const E = s.useRef(null), [Y, M] = s.useState(() => T(i)), S = Y ?? T(i), $ = y(S ?? i), b = p || c === "colgroup" || Number(a ?? 1) > 1, v = X && !b;
    s.useEffect(() => {
      const o = T(i);
      o !== void 0 && M(o);
    }, [i]);
    const q = (o) => {
      o.stopPropagation(), w == null || w(te(x, O));
    }, J = (o) => {
      var j;
      o.preventDefault(), o.stopPropagation();
      const K = o.clientX, Q = ((j = E.current) == null ? void 0 : j.offsetWidth) || S || h || 120, H = (U) => {
        const B = ae(Q + U.clientX - K, h, R);
        M(B), N == null || N(B);
      }, L = () => {
        document.removeEventListener("mousemove", H), document.removeEventListener("mouseup", L);
      };
      document.addEventListener("mousemove", H), document.addEventListener("mouseup", L);
    };
    return /* @__PURE__ */ f(
      "th",
      {
        ref: (o) => {
          E.current = o, ne(G, o);
        },
        style: {
          ...t,
          width: $ ?? (t == null ? void 0 : t.width),
          minWidth: y(h) ?? (t == null ? void 0 : t.minWidth),
          maxWidth: y(R) ?? (t == null ? void 0 : t.maxWidth)
        },
        "aria-sort": v ? re(x) : V["aria-sort"],
        className: l(
          "relative h-10 px-4 text-left align-middle font-medium text-neutral-500",
          "whitespace-nowrap",
          b && "border-b border-neutral-200 bg-neutral-100 text-center text-neutral-700",
          (v || u) && "select-none",
          k && "pr-6",
          r
        ),
        onClick: F,
        colSpan: a,
        scope: c ?? (b ? "colgroup" : void 0),
        ...V,
        children: [
          /* @__PURE__ */ f(
            "div",
            {
              className: l(
                "flex min-w-0 items-center gap-2",
                u && "flex-col items-stretch gap-1 py-2",
                b && !u && "justify-center"
              ),
              children: [
                v ? /* @__PURE__ */ f(
                  "button",
                  {
                    type: "button",
                    className: "inline-flex min-w-0 items-center gap-1 rounded-sm text-left font-medium text-inherit outline-none hover:text-neutral-800 focus-visible:ring-2 focus-visible:ring-primary-500",
                    onClick: q,
                    "aria-label": _,
                    children: [
                      /* @__PURE__ */ n("span", { className: "truncate", children: e }),
                      /* @__PURE__ */ n(oe, { direction: x })
                    ]
                  }
                ) : /* @__PURE__ */ n("span", { className: "truncate", children: e }),
                u && /* @__PURE__ */ n(
                  "input",
                  {
                    ...d,
                    type: (d == null ? void 0 : d.type) ?? "text",
                    value: A,
                    placeholder: W,
                    "aria-label": (d == null ? void 0 : d["aria-label"]) ?? W,
                    onClick: (o) => o.stopPropagation(),
                    onChange: (o) => {
                      g == null || g(o.target.value);
                    },
                    className: l(
                      "h-8 w-full min-w-[8rem] rounded-md border border-neutral-300 bg-white px-2 text-xs font-normal text-neutral-900 placeholder:text-neutral-400",
                      "focus:outline-none focus:ring-2 focus:ring-primary-500",
                      d == null ? void 0 : d.className
                    )
                  }
                )
              ]
            }
          ),
          k && /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": D,
              className: "absolute right-0 top-0 h-full w-3 cursor-col-resize touch-none border-r border-transparent outline-none hover:border-primary-400 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500",
              onMouseDown: J
            }
          )
        ]
      }
    );
  }
);
se.displayName = "TableHead";
const de = s.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = m(), c = r.colSpan;
    return /* @__PURE__ */ n(
      "td",
      {
        ref: t,
        className: l(
          "text-neutral-900",
          a === "cards" ? l(
            "flex min-w-0 flex-col gap-1 text-sm md:table-cell md:px-4 md:py-3 md:align-middle",
            "before:break-words before:text-[10px] before:font-semibold before:uppercase before:tracking-wide before:text-neutral-400",
            "before:content-[attr(data-label)] md:before:content-none",
            c && c > 1 && "md:text-center"
          ) : "px-4 py-3 align-middle",
          "break-words",
          e
        ),
        ...r
      }
    );
  }
);
de.displayName = "TableCell";
export {
  P as TableBodyView,
  z as TableCaptionView,
  de as TableCellView,
  ee as TableFooterView,
  se as TableHeadView,
  I as TableHeaderView,
  C as TableMoleculeView,
  le as TableRowView
};
//# sourceMappingURL=TableMoleculeView.js.map
