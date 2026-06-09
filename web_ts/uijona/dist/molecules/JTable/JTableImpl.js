import { jsx as f, jsxs as D, Fragment as I } from "react/jsx-runtime";
import u, { forwardRef as v, useRef as M, useState as A, useCallback as W, useMemo as w } from "react";
import { JTABLE_DEFAULTS as j } from "./InterJTable.js";
import { TableContext as B, useTableContext as k } from "./JTableContext.js";
import { TableCaptionView as H, TableCellView as x, TableFooterView as O, TableHeadView as E, TableRowView as T, JTableView as P, TableBodyView as L, TableHeaderView as R } from "./JTableView.js";
function J(t) {
  return "columns" in t && Array.isArray(t.columns);
}
function z(t) {
  return t.length === 0 ? [] : J(t[0]) ? t.flatMap((r) => r.columns) : t;
}
function G(t, r, l) {
  return l ? [...t].sort((m, o) => {
    const i = String(m[r] ?? "").localeCompare(String(o[r] ?? ""));
    return l === "asc" ? i : -i;
  }) : t;
}
const _ = {
  left: "text-left",
  center: "text-center",
  right: "text-right"
}, K = v(
  ({
    children: t,
    responsiveMode: r = j.responsiveMode,
    wrapperClassName: l,
    pagination: m,
    columns: o,
    data: i,
    caption: h,
    emptyMessage: d = "Sin resultados",
    ...a
  }, s) => {
    const p = M([]), [b, g] = A({}), e = W((C, y) => {
      g((S) => {
        if ((S[C] ?? "") === y) return S;
        if (!y) {
          const F = { ...S };
          return delete F[C], F;
        }
        return { ...S, [C]: y };
      });
    }, []), c = w(
      () => ({ responsiveMode: r, labelsRef: p, columnFilters: b, setColumnFilter: e }),
      [r, b, e]
    ), n = o !== void 0 && i !== void 0;
    return /* @__PURE__ */ f(B.Provider, { value: c, children: /* @__PURE__ */ f(
      P,
      {
        ref: s,
        responsiveMode: r,
        wrapperClassName: l,
        pagination: m,
        ...a,
        children: n ? /* @__PURE__ */ f(
          Z,
          {
            columns: o,
            data: i,
            caption: h,
            emptyMessage: d
          }
        ) : t
      }
    ) });
  }
);
K.displayName = "JTable";
function V(t) {
  return typeof t == "string" || typeof t == "number" ? String(t) : Array.isArray(t) ? t.map(V).join(" ").trim() : u.isValidElement(t) ? V(t.props.children) : "";
}
function N(t) {
  const r = Number(t ?? 1);
  return Number.isFinite(r) && r > 0 ? Math.floor(r) : 1;
}
function U(t) {
  const r = u.Children.toArray(t).filter(u.isValidElement), l = [], m = /* @__PURE__ */ new WeakMap();
  r.forEach((h, d) => {
    const a = h;
    l[d] = l[d] ?? [];
    let s = 0;
    u.Children.forEach(a.props.children, (p) => {
      if (!u.isValidElement(p)) return;
      for (; l[d][s]; ) s += 1;
      const b = p.props, g = N(b.colSpan), e = N(b.rowSpan), c = V(b.children);
      m.set(p, s);
      for (let n = 0; n < e; n += 1) {
        const C = d + n;
        l[C] = l[C] ?? [];
        for (let y = 0; y < g; y += 1)
          l[C][s + y] = { label: c };
      }
      s += g;
    });
  });
  const o = Math.max(0, ...l.map((h) => h.length));
  return { labels: Array.from({ length: o }, (h, d) => {
    var a;
    for (let s = l.length - 1; s >= 0; s -= 1) {
      const p = (a = l[s]) == null ? void 0 : a[d];
      if (p != null && p.label) return p.label;
    }
    return "";
  }), columnIndexes: m };
}
function q(t) {
  const { labels: r, columnIndexes: l } = U(t), m = u.Children.map(t, (o) => {
    if (!u.isValidElement(o)) return o;
    const i = o, h = u.Children.map(i.props.children, (d) => {
      if (!u.isValidElement(d)) return d;
      const a = l.get(d);
      return a === void 0 ? d : u.cloneElement(d, { columnIndex: a });
    });
    return u.cloneElement(i, {}, h);
  });
  return { labels: r, rows: m };
}
const Q = v(
  ({ children: t, ...r }, l) => {
    const { labelsRef: m } = k(), { labels: o, rows: i } = q(t);
    return m.current = o, /* @__PURE__ */ f(R, { ref: l, ...r, children: i });
  }
);
Q.displayName = "JTableHeader";
function X(t, r) {
  const l = Object.entries(r).filter(([, o]) => o.trim());
  if (l.length === 0) return !0;
  const m = u.Children.toArray(t.props.children).filter(u.isValidElement);
  return l.every(([o, i]) => {
    const h = m[Number(o)];
    return h ? V(h.props.children).toLowerCase().includes(i.toLowerCase()) : !1;
  });
}
const Y = v(
  ({ children: t, ...r }, l) => {
    const { labelsRef: m, responsiveMode: o, columnFilters: i } = k(), h = m.current, d = u.Children.map(t, (a) => {
      if (!u.isValidElement(a)) return a;
      const s = a;
      if (!X(s, i)) return null;
      if (o !== "cards") return s;
      const p = u.Children.map(s.props.children, (b, g) => {
        if (!u.isValidElement(b) || b.props["data-label"] !== void 0) return b;
        const e = h[g];
        return e ? u.cloneElement(b, { "data-label": e }) : b;
      });
      return u.cloneElement(s, {}, p);
    });
    return /* @__PURE__ */ f(L, { ref: l, ...r, children: d });
  }
);
Y.displayName = "JTableBody";
function Z({
  columns: t,
  data: r,
  caption: l,
  emptyMessage: m = "Sin resultados"
}) {
  const { columnFilters: o } = k(), [i, h] = A({
    key: "",
    direction: null
  }), d = t.length > 0 && J(t[0]), a = w(() => z(t), [t]), s = w(() => {
    if (!i.key || !i.direction) return r;
    const e = a.find((c) => c.key === i.key);
    return (e == null ? void 0 : e.onSortChange) !== void 0 ? r : G(r, i.key, i.direction);
  }, [r, i, a]), p = w(() => {
    const e = new Set(
      a.map((n, C) => n.filterValue === void 0 && n.onFilterChange === void 0 ? C : -1).filter((n) => n >= 0)
    ), c = Object.entries(o).filter(([n]) => e.has(Number(n))).filter(([, n]) => n.trim());
    return c.length === 0 ? s : s.filter(
      (n) => c.every(([C, y]) => {
        const S = a[Number(C)];
        return S ? String(n[S.key] ?? "").toLowerCase().includes(y.toLowerCase()) : !1;
      })
    );
  }, [s, o, a]), b = (e) => (c) => {
    e.onSortChange ? e.onSortChange(c) : h({ key: e.key, direction: c });
  }, g = (e, c) => {
    const n = e.onSortChange !== void 0, C = e.sortable ? n ? e.sortDirection ?? null : i.key === e.key ? i.direction : null : null;
    return /* @__PURE__ */ f(
      E,
      {
        columnIndex: c,
        sortable: e.sortable,
        sortDirection: C,
        onSortChange: e.sortable ? b(e) : void 0,
        filterable: e.filterable,
        filterPlaceholder: e.filterPlaceholder,
        filterValue: e.filterValue,
        onFilterChange: e.onFilterChange,
        resizable: e.resizable,
        width: e.width,
        minWidth: e.minWidth,
        maxWidth: e.maxWidth,
        children: e.header
      },
      e.key
    );
  };
  return /* @__PURE__ */ D(I, { children: [
    l && /* @__PURE__ */ f(H, { children: l }),
    /* @__PURE__ */ f(R, { children: d ? /* @__PURE__ */ D(I, { children: [
      /* @__PURE__ */ f(T, { children: t.map((e) => /* @__PURE__ */ f(E, { colSpan: e.columns.length, groupHeader: !0, children: e.label }, e.label)) }),
      /* @__PURE__ */ f(T, { children: a.map((e, c) => g(e, c)) })
    ] }) : /* @__PURE__ */ f(T, { children: t.map((e, c) => g(e, c)) }) }),
    /* @__PURE__ */ f(L, { children: p.length > 0 ? p.map((e, c) => /* @__PURE__ */ f(T, { children: a.map((n) => /* @__PURE__ */ f(
      x,
      {
        "data-label": n.header,
        className: n.align ? _[n.align] : void 0,
        children: n.render ? n.render(e[n.key], e, c) : String(e[n.key] ?? "")
      },
      n.key
    )) }, c)) : /* @__PURE__ */ f(T, { children: /* @__PURE__ */ f(x, { colSpan: a.length, children: /* @__PURE__ */ f("span", { className: "block py-6 text-center text-neutral-400", children: m }) }) }) })
  ] });
}
const le = H, ie = O, ae = T, oe = E, se = x;
export {
  K as JTableImpl,
  Y as TableBodyImpl,
  le as TableCaptionImpl,
  se as TableCellImpl,
  ie as TableFooterImpl,
  oe as TableHeadImpl,
  Q as TableHeaderImpl,
  ae as TableRowImpl
};
//# sourceMappingURL=JTableImpl.js.map
