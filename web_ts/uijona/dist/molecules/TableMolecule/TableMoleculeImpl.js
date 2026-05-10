import { jsx as d } from "react/jsx-runtime";
import r, { forwardRef as E, useRef as x, useState as F, useCallback as I, useMemo as M } from "react";
import { TABLE_MOLECULE_DEFAULTS as R } from "./InterTableMolecule.js";
import { useTableContext as y, TableContext as L } from "./TableMoleculeContext.js";
import { TableCaptionView as S, TableCellView as A, TableFooterView as H, TableHeadView as N, TableRowView as v, TableBodyView as B, TableHeaderView as O, TableMoleculeView as j } from "./TableMoleculeView.js";
const _ = E(
  ({ children: e, responsiveMode: l = R.responsiveMode, wrapperClassName: t, ...m }, s) => {
    const f = x([]), [i, n] = F({}), a = I((c, u) => {
      n((p) => {
        if ((p[c] ?? "") === u) return p;
        if (!u) {
          const b = { ...p };
          return delete b[c], b;
        }
        return { ...p, [c]: u };
      });
    }, []), o = M(
      () => ({ responsiveMode: l, labelsRef: f, columnFilters: i, setColumnFilter: a }),
      [l, i, a]
    );
    return /* @__PURE__ */ d(L.Provider, { value: o, children: /* @__PURE__ */ d(
      j,
      {
        ref: s,
        responsiveMode: l,
        wrapperClassName: t,
        ...m,
        children: e
      }
    ) });
  }
);
_.displayName = "TableMolecule";
function h(e) {
  return typeof e == "string" || typeof e == "number" ? String(e) : Array.isArray(e) ? e.map(h).join(" ").trim() : r.isValidElement(e) ? h(e.props.children) : "";
}
function V(e) {
  const l = Number(e ?? 1);
  return Number.isFinite(l) && l > 0 ? Math.floor(l) : 1;
}
function k(e) {
  const l = r.Children.toArray(e).filter(r.isValidElement), t = [], m = /* @__PURE__ */ new WeakMap();
  l.forEach((i, n) => {
    const a = i;
    t[n] = t[n] ?? [];
    let o = 0;
    r.Children.forEach(a.props.children, (c) => {
      if (!r.isValidElement(c)) return;
      for (; t[n][o]; ) o += 1;
      const u = c.props, p = V(u.colSpan), b = V(u.rowSpan), g = h(u.children);
      m.set(c, o);
      for (let T = 0; T < b; T += 1) {
        const w = n + T;
        t[w] = t[w] ?? [];
        for (let C = 0; C < p; C += 1)
          t[w][o + C] = { label: g };
      }
      o += p;
    });
  });
  const s = Math.max(0, ...t.map((i) => i.length));
  return { labels: Array.from({ length: s }, (i, n) => {
    var a;
    for (let o = t.length - 1; o >= 0; o -= 1) {
      const c = (a = t[o]) == null ? void 0 : a[n];
      if (c != null && c.label) return c.label;
    }
    return "";
  }), columnIndexes: m };
}
function P(e) {
  const { labels: l, columnIndexes: t } = k(e), m = r.Children.map(e, (s) => {
    if (!r.isValidElement(s)) return s;
    const f = s, i = r.Children.map(f.props.children, (n) => {
      if (!r.isValidElement(n)) return n;
      const a = t.get(n);
      return a === void 0 ? n : r.cloneElement(n, { columnIndex: a });
    });
    return r.cloneElement(f, {}, i);
  });
  return { labels: l, rows: m };
}
const U = E(
  ({ children: e, ...l }, t) => {
    const { labelsRef: m } = y(), { labels: s, rows: f } = P(e);
    return m.current = s, /* @__PURE__ */ d(O, { ref: t, ...l, children: f });
  }
);
U.displayName = "TableHeader";
function W(e, l) {
  const t = Object.entries(l).filter(([, s]) => s.trim());
  if (t.length === 0) return !0;
  const m = r.Children.toArray(e.props.children).filter(r.isValidElement);
  return t.every(([s, f]) => {
    const i = m[Number(s)];
    return i ? h(i.props.children).toLowerCase().includes(f.toLowerCase()) : !1;
  });
}
const D = E(
  ({ children: e, ...l }, t) => {
    const { labelsRef: m, responsiveMode: s, columnFilters: f } = y(), i = m.current, n = r.Children.map(e, (a) => {
      if (!r.isValidElement(a)) return a;
      const o = a;
      if (!W(o, f)) return null;
      if (s !== "cards") return o;
      const c = r.Children.map(o.props.children, (u, p) => {
        if (!r.isValidElement(u) || u.props["data-label"] !== void 0) return u;
        const b = i[p];
        return b ? r.cloneElement(u, { "data-label": b }) : u;
      });
      return r.cloneElement(o, {}, c);
    });
    return /* @__PURE__ */ d(B, { ref: t, ...l, children: n });
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
