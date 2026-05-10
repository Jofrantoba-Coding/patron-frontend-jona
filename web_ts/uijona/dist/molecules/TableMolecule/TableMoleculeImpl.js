import { jsx as b } from "react/jsx-runtime";
import n, { forwardRef as E, useRef as y, useMemo as g } from "react";
import { TABLE_MOLECULE_DEFAULTS as R } from "./InterTableMolecule.js";
import { useTableContext as C, TableContext as M } from "./TableMoleculeContext.js";
import { TableCaptionView as S, TableCellView as x, TableFooterView as A, TableHeadView as H, TableRowView as I, TableBodyView as L, TableHeaderView as N, TableMoleculeView as B } from "./TableMoleculeView.js";
const F = E(
  ({ children: e, responsiveMode: r = R.responsiveMode, wrapperClassName: t, ...p }, i) => {
    const o = y([]), c = g(
      () => ({ responsiveMode: r, labelsRef: o }),
      [r]
    );
    return /* @__PURE__ */ b(M.Provider, { value: c, children: /* @__PURE__ */ b(
      B,
      {
        ref: i,
        responsiveMode: r,
        wrapperClassName: t,
        ...p,
        children: e
      }
    ) });
  }
);
F.displayName = "TableMolecule";
function w(e) {
  return typeof e == "string" || typeof e == "number" ? String(e) : Array.isArray(e) ? e.map(w).join(" ").trim() : n.isValidElement(e) ? w(e.props.children) : "";
}
function V(e) {
  const r = Number(e ?? 1);
  return Number.isFinite(r) && r > 0 ? Math.floor(r) : 1;
}
function v(e) {
  const r = n.Children.toArray(e).filter(n.isValidElement), t = [];
  r.forEach((i, o) => {
    const c = i;
    t[o] = t[o] ?? [];
    let l = 0;
    n.Children.forEach(c.props.children, (a) => {
      if (!n.isValidElement(a)) return;
      for (; t[o][l]; ) l += 1;
      const m = a.props, s = V(m.colSpan), u = V(m.rowSpan), f = w(m.children);
      for (let d = 0; d < u; d += 1) {
        const T = o + d;
        t[T] = t[T] ?? [];
        for (let h = 0; h < s; h += 1)
          t[T][l + h] = { label: f, rowIndex: o };
      }
      l += s;
    });
  });
  const p = Math.max(0, ...t.map((i) => i.length));
  return Array.from({ length: p }, (i, o) => {
    var c;
    for (let l = t.length - 1; l >= 0; l -= 1) {
      const a = (c = t[l]) == null ? void 0 : c[o];
      if (a != null && a.label) return a.label;
    }
    return "";
  });
}
const O = E(
  ({ children: e, ...r }, t) => {
    const { labelsRef: p } = C();
    return p.current = v(e), /* @__PURE__ */ b(N, { ref: t, ...r, children: e });
  }
);
O.displayName = "TableHeader";
const _ = E(
  ({ children: e, ...r }, t) => {
    const { labelsRef: p, responsiveMode: i } = C(), o = p.current, c = i === "cards" ? n.Children.map(e, (l) => {
      if (!n.isValidElement(l)) return l;
      const a = l, m = n.Children.map(a.props.children, (s, u) => {
        if (!n.isValidElement(s) || s.props["data-label"] !== void 0) return s;
        const f = o[u];
        return f ? n.cloneElement(s, { "data-label": f }) : s;
      });
      return n.cloneElement(a, {}, m);
    }) : e;
    return /* @__PURE__ */ b(L, { ref: t, ...r, children: c });
  }
);
_.displayName = "TableBody";
const k = S, q = A, z = I, G = H, J = x;
export {
  _ as TableBodyImpl,
  k as TableCaptionImpl,
  J as TableCellImpl,
  q as TableFooterImpl,
  G as TableHeadImpl,
  O as TableHeaderImpl,
  F as TableMoleculeImpl,
  z as TableRowImpl
};
//# sourceMappingURL=TableMoleculeImpl.js.map
