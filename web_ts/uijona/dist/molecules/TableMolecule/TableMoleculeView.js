import { jsx as n, jsxs as w } from "react/jsx-runtime";
import l from "react";
import { cn as s } from "../../lib/cn.js";
import { useTableContext as c } from "./TableMoleculeContext.js";
const te = {
  scroll: "relative w-full max-w-full overflow-x-auto rounded-md border border-neutral-200",
  cards: "relative w-full max-w-full",
  none: "relative w-full max-w-full overflow-x-auto"
}, re = l.forwardRef(
  ({ className: e, wrapperClassName: r, responsiveMode: t = "scroll", style: a, ...d }, f) => /* @__PURE__ */ n("div", { className: s(te[t], r), children: /* @__PURE__ */ n(
    "table",
    {
      ref: f,
      style: t === "cards" ? void 0 : a,
      className: s(
        "caption-bottom text-sm text-neutral-900",
        t === "scroll" && "w-full min-w-max",
        t === "cards" && "block w-full min-w-0 md:table",
        t === "none" && "w-full min-w-max",
        e
      ),
      ...d
    }
  ) })
);
re.displayName = "TableMolecule";
const ae = l.forwardRef(
  ({ className: e, ...r }, t) => /* @__PURE__ */ n("caption", { ref: t, className: s("mt-4 text-sm text-neutral-500", e), ...r })
);
ae.displayName = "TableCaption";
const oe = l.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = c();
    return /* @__PURE__ */ n(
      "thead",
      {
        ref: t,
        className: s(
          a === "cards" ? "hidden md:table-header-group" : "table-header-group",
          "bg-neutral-50 [&_tr]:border-b",
          e
        ),
        ...r
      }
    );
  }
);
oe.displayName = "TableHeader";
const ne = l.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = c();
    return /* @__PURE__ */ n(
      "tbody",
      {
        ref: t,
        className: s(
          a === "cards" ? "block md:table-row-group" : "table-row-group",
          "[&_tr:last-child]:border-b-0",
          e
        ),
        ...r
      }
    );
  }
);
ne.displayName = "TableBody";
const le = l.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = c();
    return /* @__PURE__ */ n(
      "tfoot",
      {
        ref: t,
        className: s(
          a === "cards" ? "block md:table-footer-group" : "table-footer-group",
          "bg-neutral-50 font-medium [&>tr]:last:border-b-0",
          e
        ),
        ...r
      }
    );
  }
);
le.displayName = "TableFooter";
function se(e, r) {
  const t = r.indexOf(e);
  return r[t === -1 || t === r.length - 1 ? 0 : t + 1];
}
function ie(e) {
  if (e === "asc") return "ascending";
  if (e === "desc") return "descending";
}
function k(e) {
  return typeof e == "number" ? `${e}px` : e;
}
function R(e) {
  if (typeof e == "number") return e;
  if (typeof e == "string" && e.endsWith("px")) return Number.parseFloat(e);
}
function de(e, r, t) {
  const a = r ?? 48, d = t ?? Number.POSITIVE_INFINITY;
  return Math.min(Math.max(e, a), d);
}
function ce({ direction: e }) {
  return /* @__PURE__ */ w("svg", { className: "h-3.5 w-3.5 shrink-0", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, "aria-hidden": "true", children: [
    /* @__PURE__ */ n("polyline", { points: "6 9 12 3 18 9", className: e === "asc" ? "text-primary-600" : "text-neutral-300" }),
    /* @__PURE__ */ n("polyline", { points: "6 15 12 21 18 15", className: e === "desc" ? "text-primary-600" : "text-neutral-300" })
  ] });
}
function me(e, r) {
  if (typeof e == "function") {
    e(r);
    return;
  }
  e && (e.current = r);
}
const ue = l.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = c();
    return /* @__PURE__ */ n(
      "tr",
      {
        ref: t,
        className: s(
          "transition-colors hover:bg-neutral-50 data-[state=selected]:bg-primary-50",
          a === "cards" ? "mb-3 grid min-w-0 grid-cols-1 gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm md:table-row md:rounded-none md:border-0 md:border-b md:border-neutral-200 md:bg-transparent md:p-0 md:shadow-none" : "border-b border-neutral-200",
          e
        ),
        ...r
      }
    );
  }
);
ue.displayName = "TableRow";
const be = l.forwardRef(
  ({
    children: e,
    className: r,
    style: t,
    columnIndex: a,
    colSpan: d,
    scope: f,
    groupHeader: O = !1,
    sortable: A = !1,
    sortDirection: g = null,
    sortLabel: D,
    sortCycle: G = ["asc", "desc", null],
    onSortChange: v,
    filterable: p = !1,
    filterValue: m,
    filterPlaceholder: V = "Filtrar...",
    filterInputProps: i,
    onFilterChange: h,
    resizable: E = !1,
    width: u,
    minWidth: N,
    maxWidth: M,
    resizeHandleLabel: Y = "Redimensionar columna",
    onColumnResize: y,
    onClick: $,
    ...S
  }, q) => {
    const { columnFilters: C, setColumnFilter: T } = c(), F = l.useRef(null), [J, K] = l.useState(""), [Q, H] = l.useState(() => R(u)), L = Q ?? R(u), U = k(L ?? u), x = O || f === "colgroup" || Number(d ?? 1) > 1, W = A && !x, Z = m ?? (a !== void 0 ? C[a] ?? "" : J);
    l.useEffect(() => {
      const o = R(u);
      o !== void 0 && H(o);
    }, [u]), l.useEffect(() => {
      m !== void 0 && a !== void 0 && T(a, m);
    }, [a, m, T]);
    const z = (o) => {
      o.stopPropagation(), v == null || v(se(g, G));
    }, I = (o) => {
      var X;
      o.preventDefault(), o.stopPropagation();
      const b = o.clientX, P = ((X = F.current) == null ? void 0 : X.offsetWidth) || L || N || 120, j = (ee) => {
        const _ = de(P + ee.clientX - b, N, M);
        H(_), y == null || y(_);
      }, B = () => {
        document.removeEventListener("mousemove", j), document.removeEventListener("mouseup", B);
      };
      document.addEventListener("mousemove", j), document.addEventListener("mouseup", B);
    };
    return /* @__PURE__ */ w(
      "th",
      {
        ref: (o) => {
          F.current = o, me(q, o);
        },
        style: {
          ...t,
          width: U ?? (t == null ? void 0 : t.width),
          minWidth: k(N) ?? (t == null ? void 0 : t.minWidth),
          maxWidth: k(M) ?? (t == null ? void 0 : t.maxWidth)
        },
        "aria-sort": W ? ie(g) : S["aria-sort"],
        className: s(
          "relative h-10 px-4 text-left align-middle font-medium text-neutral-500",
          "whitespace-nowrap",
          x && "border-b border-neutral-200 bg-neutral-100 text-center text-neutral-700",
          (W || p) && "select-none",
          E && "pr-6",
          r
        ),
        onClick: $,
        colSpan: d,
        scope: f ?? (x ? "colgroup" : void 0),
        ...S,
        children: [
          /* @__PURE__ */ w(
            "div",
            {
              className: s(
                "flex min-w-0 items-center gap-2",
                p && "flex-col items-stretch gap-1 py-2",
                x && !p && "justify-center"
              ),
              children: [
                W ? /* @__PURE__ */ w(
                  "button",
                  {
                    type: "button",
                    className: "inline-flex min-w-0 items-center gap-1 rounded-sm text-left font-medium text-inherit outline-none hover:text-neutral-800 focus-visible:ring-2 focus-visible:ring-primary-500",
                    onClick: z,
                    "aria-label": D,
                    children: [
                      /* @__PURE__ */ n("span", { className: "truncate", children: e }),
                      /* @__PURE__ */ n(ce, { direction: g })
                    ]
                  }
                ) : /* @__PURE__ */ n("span", { className: "truncate", children: e }),
                p && /* @__PURE__ */ n(
                  "input",
                  {
                    ...i,
                    type: (i == null ? void 0 : i.type) ?? "text",
                    value: Z,
                    placeholder: V,
                    "aria-label": (i == null ? void 0 : i["aria-label"]) ?? V,
                    onClick: (o) => o.stopPropagation(),
                    onChange: (o) => {
                      const b = o.target.value;
                      m === void 0 && (a !== void 0 ? T(a, b) : K(b)), h == null || h(b);
                    },
                    className: s(
                      "h-8 w-full min-w-[8rem] rounded-md border border-neutral-300 bg-white px-2 text-xs font-normal text-neutral-900 placeholder:text-neutral-400",
                      "focus:outline-none focus:ring-2 focus:ring-primary-500",
                      i == null ? void 0 : i.className
                    )
                  }
                )
              ]
            }
          ),
          E && /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": Y,
              className: "absolute right-0 top-0 h-full w-3 cursor-col-resize touch-none border-r border-transparent outline-none hover:border-primary-400 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500",
              onMouseDown: I
            }
          )
        ]
      }
    );
  }
);
be.displayName = "TableHead";
const fe = l.forwardRef(
  ({ className: e, ...r }, t) => {
    const { responsiveMode: a } = c(), d = r.colSpan;
    return /* @__PURE__ */ n(
      "td",
      {
        ref: t,
        className: s(
          "text-neutral-900",
          a === "cards" ? s(
            "flex min-w-0 flex-col gap-1 text-sm md:table-cell md:px-4 md:py-3 md:align-middle",
            "before:break-words before:text-[10px] before:font-semibold before:uppercase before:tracking-wide before:text-neutral-400",
            "before:content-[attr(data-label)] md:before:content-none",
            d && d > 1 && "md:text-center"
          ) : "px-4 py-3 align-middle",
          "break-words",
          e
        ),
        ...r
      }
    );
  }
);
fe.displayName = "TableCell";
export {
  ne as TableBodyView,
  ae as TableCaptionView,
  fe as TableCellView,
  le as TableFooterView,
  be as TableHeadView,
  oe as TableHeaderView,
  re as TableMoleculeView,
  ue as TableRowView
};
//# sourceMappingURL=TableMoleculeView.js.map
