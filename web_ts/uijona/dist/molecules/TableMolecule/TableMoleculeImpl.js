import { jsx as h } from "react/jsx-runtime";
import r, { forwardRef as V, useRef as x, useState as F, useCallback as I, useMemo as M } from "react";
import { TABLE_MOLECULE_DEFAULTS as R } from "./InterTableMolecule.js";
import { useTableContext as g, TableContext as L } from "./TableMoleculeContext.js";
import { TableCaptionView as S, TableCellView as A, TableFooterView as H, TableHeadView as N, TableRowView as v, TableBodyView as B, TableHeaderView as O, TableMoleculeView as j } from "./TableMoleculeView.js";
const _ = V(
  ({ children: e, responsiveMode: l = R.responsiveMode, wrapperClassName: t, pagination: u, ...s }, f) => {
    const a = x([]), [n, c] = F({}), o = I((i, b) => {
      c((p) => {
        if ((p[i] ?? "") === b) return p;
        if (!b) {
          const d = { ...p };
          return delete d[i], d;
        }
        return { ...p, [i]: b };
      });
    }, []), m = M(
      () => ({ responsiveMode: l, labelsRef: a, columnFilters: n, setColumnFilter: o }),
      [l, n, o]
    );
    return /* @__PURE__ */ h(L.Provider, { value: m, children: /* @__PURE__ */ h(
      j,
      {
        ref: f,
        responsiveMode: l,
        wrapperClassName: t,
        pagination: u,
        ...s,
        children: e
      }
    ) });
  }
);
_.displayName = "TableMolecule";
function T(e) {
  return typeof e == "string" || typeof e == "number" ? String(e) : Array.isArray(e) ? e.map(T).join(" ").trim() : r.isValidElement(e) ? T(e.props.children) : "";
}
function y(e) {
  const l = Number(e ?? 1);
  return Number.isFinite(l) && l > 0 ? Math.floor(l) : 1;
}
function k(e) {
  const l = r.Children.toArray(e).filter(r.isValidElement), t = [], u = /* @__PURE__ */ new WeakMap();
  l.forEach((a, n) => {
    const c = a;
    t[n] = t[n] ?? [];
    let o = 0;
    r.Children.forEach(c.props.children, (m) => {
      if (!r.isValidElement(m)) return;
      for (; t[n][o]; ) o += 1;
      const i = m.props, b = y(i.colSpan), p = y(i.rowSpan), d = T(i.children);
      u.set(m, o);
      for (let w = 0; w < p; w += 1) {
        const C = n + w;
        t[C] = t[C] ?? [];
        for (let E = 0; E < b; E += 1)
          t[C][o + E] = { label: d };
      }
      o += b;
    });
  });
  const s = Math.max(0, ...t.map((a) => a.length));
  return { labels: Array.from({ length: s }, (a, n) => {
    var c;
    for (let o = t.length - 1; o >= 0; o -= 1) {
      const m = (c = t[o]) == null ? void 0 : c[n];
      if (m != null && m.label) return m.label;
    }
    return "";
  }), columnIndexes: u };
}
function P(e) {
  const { labels: l, columnIndexes: t } = k(e), u = r.Children.map(e, (s) => {
    if (!r.isValidElement(s)) return s;
    const f = s, a = r.Children.map(f.props.children, (n) => {
      if (!r.isValidElement(n)) return n;
      const c = t.get(n);
      return c === void 0 ? n : r.cloneElement(n, { columnIndex: c });
    });
    return r.cloneElement(f, {}, a);
  });
  return { labels: l, rows: u };
}
const U = V(
  ({ children: e, ...l }, t) => {
    const { labelsRef: u } = g(), { labels: s, rows: f } = P(e);
    return u.current = s, /* @__PURE__ */ h(O, { ref: t, ...l, children: f });
  }
);
U.displayName = "TableHeader";
function W(e, l) {
  const t = Object.entries(l).filter(([, s]) => s.trim());
  if (t.length === 0) return !0;
  const u = r.Children.toArray(e.props.children).filter(r.isValidElement);
  return t.every(([s, f]) => {
    const a = u[Number(s)];
    return a ? T(a.props.children).toLowerCase().includes(f.toLowerCase()) : !1;
  });
}
const D = V(
  ({ children: e, ...l }, t) => {
    const { labelsRef: u, responsiveMode: s, columnFilters: f } = g(), a = u.current, n = r.Children.map(e, (c) => {
      if (!r.isValidElement(c)) return c;
      const o = c;
      if (!W(o, f)) return null;
      if (s !== "cards") return o;
      const m = r.Children.map(o.props.children, (i, b) => {
        if (!r.isValidElement(i) || i.props["data-label"] !== void 0) return i;
        const p = a[b];
        return p ? r.cloneElement(i, { "data-label": p }) : i;
      });
      return r.cloneElement(o, {}, m);
    });
    return /* @__PURE__ */ h(B, { ref: t, ...l, children: n });
  }
);
D.displayName = "TableBody";
const Q = S, X = H, Y = v, Z = N, $ = A;
export {
  D as TableBodyImpl,
  Q as TableCaptionImpl,
  $ as TableCellImpl,
  X as TableFooterImpl,
  Z as TableHeadImpl,
  U as TableHeaderImpl,
  _ as TableMoleculeImpl,
  Y as TableRowImpl
};
//# sourceMappingURL=TableMoleculeImpl.js.map
