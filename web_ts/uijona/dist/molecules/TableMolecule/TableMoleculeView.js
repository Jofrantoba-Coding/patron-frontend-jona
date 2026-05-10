import { jsx as o, jsxs as u } from "react/jsx-runtime";
import s from "react";
import { cn as l } from "../../lib/cn.js";
import { useTableContext as m } from "./TableMoleculeContext.js";
const G = {
  scroll: "relative w-full max-w-full overflow-x-auto rounded-md border border-neutral-200",
  cards: "relative w-full max-w-full",
  none: "relative w-full max-w-full"
}, J = s.forwardRef(
  ({ className: e, wrapperClassName: a, responsiveMode: t = "scroll", style: r, ...d }, b) => /* @__PURE__ */ o("div", { className: l(G[t], a), children: /* @__PURE__ */ o(
    "table",
    {
      ref: b,
      style: t === "cards" ? void 0 : r,
      className: l(
        "caption-bottom text-sm text-neutral-900",
        t === "scroll" && "w-full min-w-max",
        t === "cards" && "block w-full min-w-0 md:table",
        t === "none" && "w-full",
        e
      ),
      ...d
    }
  ) })
);
J.displayName = "TableMolecule";
const K = s.forwardRef(
  ({ className: e, ...a }, t) => /* @__PURE__ */ o("caption", { ref: t, className: l("mt-4 text-sm text-neutral-500", e), ...a })
);
K.displayName = "TableCaption";
const Q = s.forwardRef(
  ({ className: e, ...a }, t) => {
    const { responsiveMode: r } = m();
    return /* @__PURE__ */ o(
      "thead",
      {
        ref: t,
        className: l(
          r === "cards" ? "hidden md:table-header-group" : "table-header-group",
          "bg-neutral-50 [&_tr]:border-b",
          e
        ),
        ...a
      }
    );
  }
);
Q.displayName = "TableHeader";
const U = s.forwardRef(
  ({ className: e, ...a }, t) => {
    const { responsiveMode: r } = m();
    return /* @__PURE__ */ o(
      "tbody",
      {
        ref: t,
        className: l(
          r === "cards" ? "block md:table-row-group" : "table-row-group",
          "[&_tr:last-child]:border-b-0",
          e
        ),
        ...a
      }
    );
  }
);
U.displayName = "TableBody";
const Z = s.forwardRef(
  ({ className: e, ...a }, t) => {
    const { responsiveMode: r } = m();
    return /* @__PURE__ */ o(
      "tfoot",
      {
        ref: t,
        className: l(
          r === "cards" ? "block md:table-footer-group" : "table-footer-group",
          "bg-neutral-50 font-medium [&>tr]:last:border-b-0",
          e
        ),
        ...a
      }
    );
  }
);
Z.displayName = "TableFooter";
function C(e, a) {
  const t = a.indexOf(e);
  return a[t === -1 || t === a.length - 1 ? 0 : t + 1];
}
function z(e) {
  if (e === "asc") return "ascending";
  if (e === "desc") return "descending";
}
function h(e) {
  return typeof e == "number" ? `${e}px` : e;
}
function N(e) {
  if (typeof e == "number") return e;
  if (typeof e == "string" && e.endsWith("px")) return Number.parseFloat(e);
}
function I(e, a, t) {
  const r = a ?? 48, d = t ?? Number.POSITIVE_INFINITY;
  return Math.min(Math.max(e, r), d);
}
function P({ direction: e }) {
  return /* @__PURE__ */ u("svg", { className: "h-3.5 w-3.5 shrink-0", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, "aria-hidden": "true", children: [
    /* @__PURE__ */ o("polyline", { points: "6 9 12 3 18 9", className: e === "asc" ? "text-primary-600" : "text-neutral-300" }),
    /* @__PURE__ */ o("polyline", { points: "6 15 12 21 18 15", className: e === "desc" ? "text-primary-600" : "text-neutral-300" })
  ] });
}
function ee(e, a) {
  if (typeof e == "function") {
    e(a);
    return;
  }
  e && (e.current = a);
}
const te = s.forwardRef(
  ({ className: e, ...a }, t) => {
    const { responsiveMode: r } = m();
    return /* @__PURE__ */ o(
      "tr",
      {
        ref: t,
        className: l(
          "transition-colors hover:bg-neutral-50 data-[state=selected]:bg-primary-50",
          r === "cards" ? "mb-3 grid min-w-0 grid-cols-1 gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm md:table-row md:rounded-none md:border-0 md:border-b md:border-neutral-200 md:bg-transparent md:p-0 md:shadow-none" : "border-b border-neutral-200",
          e
        ),
        ...a
      }
    );
  }
);
te.displayName = "TableRow";
const ae = s.forwardRef(
  ({
    children: e,
    className: a,
    style: t,
    sortable: r = !1,
    sortDirection: d = null,
    sortLabel: b,
    sortCycle: L = ["asc", "desc", null],
    onSortChange: f,
    filterable: p = !1,
    filterValue: B = "",
    filterPlaceholder: v = "Filtrar...",
    filterInputProps: i,
    onFilterChange: x,
    resizable: T = !1,
    width: c,
    minWidth: w,
    maxWidth: y,
    resizeHandleLabel: X = "Redimensionar columna",
    onColumnResize: g,
    onClick: _,
    ...W
  }, j) => {
    const k = s.useRef(null), [O, R] = s.useState(() => N(c)), V = O ?? N(c), A = h(V ?? c);
    s.useEffect(() => {
      const n = N(c);
      n !== void 0 && R(n);
    }, [c]);
    const D = (n) => {
      n.stopPropagation(), f == null || f(C(d, L));
    }, F = (n) => {
      var S;
      n.preventDefault(), n.stopPropagation();
      const Y = n.clientX, $ = ((S = k.current) == null ? void 0 : S.offsetWidth) || V || w || 120, E = (q) => {
        const H = I($ + q.clientX - Y, w, y);
        R(H), g == null || g(H);
      }, M = () => {
        document.removeEventListener("mousemove", E), document.removeEventListener("mouseup", M);
      };
      document.addEventListener("mousemove", E), document.addEventListener("mouseup", M);
    };
    return /* @__PURE__ */ u(
      "th",
      {
        ref: (n) => {
          k.current = n, ee(j, n);
        },
        style: {
          ...t,
          width: A ?? (t == null ? void 0 : t.width),
          minWidth: h(w) ?? (t == null ? void 0 : t.minWidth),
          maxWidth: h(y) ?? (t == null ? void 0 : t.maxWidth)
        },
        "aria-sort": r ? z(d) : W["aria-sort"],
        className: l(
          "relative h-10 px-4 text-left align-middle font-medium text-neutral-500",
          "whitespace-nowrap",
          (r || p) && "select-none",
          T && "pr-6",
          a
        ),
        onClick: _,
        ...W,
        children: [
          /* @__PURE__ */ u("div", { className: l("flex min-w-0 items-center gap-2", p && "flex-col items-stretch gap-1 py-2"), children: [
            r ? /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: "inline-flex min-w-0 items-center gap-1 rounded-sm text-left font-medium text-inherit outline-none hover:text-neutral-800 focus-visible:ring-2 focus-visible:ring-primary-500",
                onClick: D,
                "aria-label": b,
                children: [
                  /* @__PURE__ */ o("span", { className: "truncate", children: e }),
                  /* @__PURE__ */ o(P, { direction: d })
                ]
              }
            ) : /* @__PURE__ */ o("span", { className: "truncate", children: e }),
            p && /* @__PURE__ */ o(
              "input",
              {
                ...i,
                type: (i == null ? void 0 : i.type) ?? "text",
                value: B,
                placeholder: v,
                "aria-label": (i == null ? void 0 : i["aria-label"]) ?? v,
                onClick: (n) => n.stopPropagation(),
                onChange: (n) => {
                  x == null || x(n.target.value);
                },
                className: l(
                  "h-8 w-full min-w-[8rem] rounded-md border border-neutral-300 bg-white px-2 text-xs font-normal text-neutral-900 placeholder:text-neutral-400",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500",
                  i == null ? void 0 : i.className
                )
              }
            )
          ] }),
          T && /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              "aria-label": X,
              className: "absolute right-0 top-0 h-full w-3 cursor-col-resize touch-none border-r border-transparent outline-none hover:border-primary-400 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500",
              onMouseDown: F
            }
          )
        ]
      }
    );
  }
);
ae.displayName = "TableHead";
const re = s.forwardRef(
  ({ className: e, ...a }, t) => {
    const { responsiveMode: r } = m(), d = a.colSpan;
    return /* @__PURE__ */ o(
      "td",
      {
        ref: t,
        className: l(
          "text-neutral-900",
          r === "cards" ? l(
            "flex min-w-0 flex-col gap-1 text-sm md:table-cell md:px-4 md:py-3 md:align-middle",
            "before:break-words before:text-[10px] before:font-semibold before:uppercase before:tracking-wide before:text-neutral-400",
            "before:content-[attr(data-label)] md:before:content-none",
            d && d > 1 && "md:text-center"
          ) : "px-4 py-3 align-middle",
          "break-words",
          e
        ),
        ...a
      }
    );
  }
);
re.displayName = "TableCell";
export {
  U as TableBodyView,
  K as TableCaptionView,
  re as TableCellView,
  Z as TableFooterView,
  ae as TableHeadView,
  Q as TableHeaderView,
  J as TableMoleculeView,
  te as TableRowView
};
//# sourceMappingURL=TableMoleculeView.js.map
