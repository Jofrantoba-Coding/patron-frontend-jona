import { jsx as p } from "react/jsx-runtime";
import r, { forwardRef as c, useRef as V, useMemo as C } from "react";
import { TABLE_MOLECULE_DEFAULTS as h } from "./InterTableMolecule.js";
import { useTableContext as T, TableContext as w } from "./TableMoleculeContext.js";
import { TableCaptionView as y, TableCellView as I, TableFooterView as R, TableHeadView as x, TableRowView as H, TableBodyView as L, TableHeaderView as M, TableMoleculeView as A } from "./TableMoleculeView.js";
const B = c(
  ({ children: e, responsiveMode: l = h.responsiveMode, wrapperClassName: i, ...s }, t) => {
    const a = V([]), n = C(
      () => ({ responsiveMode: l, labelsRef: a }),
      [l]
    );
    return /* @__PURE__ */ p(w.Provider, { value: n, children: /* @__PURE__ */ p(
      A,
      {
        ref: t,
        responsiveMode: l,
        wrapperClassName: i,
        ...s,
        children: e
      }
    ) });
  }
);
B.displayName = "TableMolecule";
function b(e) {
  return typeof e == "string" || typeof e == "number" ? String(e) : Array.isArray(e) ? e.map(b).join(" ").trim() : r.isValidElement(e) ? b(e.props.children) : "";
}
const g = c(
  ({ children: e, ...l }, i) => {
    const { labelsRef: s } = T(), t = [];
    return r.Children.forEach(e, (a) => {
      r.isValidElement(a) && r.Children.forEach(
        a.props.children,
        (n) => {
          r.isValidElement(n) && t.push(b(n.props.children));
        }
      );
    }), s.current = t, /* @__PURE__ */ p(M, { ref: i, ...l, children: e });
  }
);
g.displayName = "TableHeader";
const v = c(
  ({ children: e, ...l }, i) => {
    const { labelsRef: s, responsiveMode: t } = T(), a = s.current, n = t === "cards" ? r.Children.map(e, (m) => {
      if (!r.isValidElement(m)) return m;
      const u = m, d = r.Children.map(u.props.children, (o, E) => {
        if (!r.isValidElement(o) || o.props["data-label"] !== void 0) return o;
        const f = a[E];
        return f ? r.cloneElement(o, { "data-label": f }) : o;
      });
      return r.cloneElement(u, {}, d);
    }) : e;
    return /* @__PURE__ */ p(L, { ref: i, ...l, children: n });
  }
);
v.displayName = "TableBody";
const _ = y, D = R, O = H, P = x, W = I;
export {
  v as TableBodyImpl,
  _ as TableCaptionImpl,
  W as TableCellImpl,
  D as TableFooterImpl,
  P as TableHeadImpl,
  g as TableHeaderImpl,
  B as TableMoleculeImpl,
  O as TableRowImpl
};
//# sourceMappingURL=TableMoleculeImpl.js.map
