import { jsx as F } from "react/jsx-runtime";
import { useState as d, useMemo as f } from "react";
import { DATA_TABLE_MOLECULE_DEFAULTS as N } from "./InterDataTableMolecule.js";
import { DataTableMoleculeView as T } from "./DataTableMoleculeView.js";
function D(e) {
  const i = { ...N, ...e }, [y, g] = d(void 0), [h, C] = d(""), l = e.sort ?? y, o = e.filterValue ?? h, S = (n) => {
    var t;
    g(n.direction === null ? void 0 : n), (t = e.onSortChange) == null || t.call(e, n);
  }, w = (n) => {
    var t;
    C(n), (t = e.onFilterChange) == null || t.call(e, n);
  }, r = f(() => {
    if (e.filterValue !== void 0 || !o.trim()) return e.data;
    const n = o.toLowerCase();
    return e.data.filter(
      (t) => e.columns.some((a) => {
        const c = t[a.key];
        return String(c ?? "").toLowerCase().includes(n);
      })
    );
  }, [e.data, e.columns, o, e.filterValue]), k = f(() => e.sort !== void 0 || !l || l.direction === null || !e.columns.find((t) => t.key === l.key) ? r : [...r].sort((t, a) => {
    const c = t[l.key], u = a[l.key], m = String(c ?? ""), b = String(u ?? ""), s = isNaN(Number(m)) ? m.localeCompare(b) : Number(m) - Number(u);
    return l.direction === "asc" ? s : -s;
  }), [r, l, e.columns, e.sort]);
  return /* @__PURE__ */ F(
    T,
    {
      columns: e.columns,
      rows: k,
      rowKey: e.rowKey,
      sort: l,
      loading: i.loading,
      emptyTitle: i.emptyTitle,
      emptyDescription: i.emptyDescription,
      filterValue: o,
      filterPlaceholder: i.filterPlaceholder,
      showFilter: i.showFilter,
      stickyHeader: i.stickyHeader,
      className: e.className,
      onSortChange: S,
      onFilterChange: w,
      onRowClick: e.onRowClick
    }
  );
}
D.displayName = "DataTableMolecule";
export {
  D as DataTableMoleculeImpl
};
//# sourceMappingURL=DataTableMoleculeImpl.js.map
