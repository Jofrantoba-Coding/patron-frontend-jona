import { jsx as t } from "react/jsx-runtime";
import r from "react";
import { cn as o } from "../lib/cn.js";
const d = r.forwardRef(
  ({ className: e, ...a }, l) => /* @__PURE__ */ t("div", { className: "relative w-full overflow-auto rounded-md border border-neutral-200", children: /* @__PURE__ */ t("table", { ref: l, className: o("w-full caption-bottom text-sm", e), ...a }) })
);
d.displayName = "TableMolecule";
const s = r.forwardRef(
  ({ className: e, ...a }, l) => /* @__PURE__ */ t("caption", { ref: l, className: o("mt-4 text-sm text-neutral-500", e), ...a })
);
s.displayName = "TableCaption";
const m = r.forwardRef(
  ({ className: e, ...a }, l) => /* @__PURE__ */ t("thead", { ref: l, className: o("bg-neutral-50 [&_tr]:border-b", e), ...a })
);
m.displayName = "TableHeader";
const b = r.forwardRef(
  ({ className: e, ...a }, l) => /* @__PURE__ */ t("tbody", { ref: l, className: o("[&_tr:last-child]:border-0", e), ...a })
);
b.displayName = "TableBody";
const n = r.forwardRef(
  ({ className: e, ...a }, l) => /* @__PURE__ */ t("tfoot", { ref: l, className: o("bg-neutral-50 font-medium [&>tr]:last:border-b-0", e), ...a })
);
n.displayName = "TableFooter";
const i = r.forwardRef(
  ({ className: e, ...a }, l) => /* @__PURE__ */ t("tr", { ref: l, className: o("border-b border-neutral-200 transition-colors hover:bg-neutral-50 data-[state=selected]:bg-primary-50", e), ...a })
);
i.displayName = "TableRow";
const c = r.forwardRef(
  ({ className: e, ...a }, l) => /* @__PURE__ */ t("th", { ref: l, className: o("h-10 px-4 text-left align-middle font-medium text-neutral-500", e), ...a })
);
c.displayName = "TableHead";
const f = r.forwardRef(
  ({ className: e, ...a }, l) => /* @__PURE__ */ t("td", { ref: l, className: o("px-4 py-3 align-middle text-neutral-900", e), ...a })
);
f.displayName = "TableCell";
export {
  b as TableBody,
  s as TableCaption,
  f as TableCell,
  n as TableFooter,
  c as TableHead,
  m as TableHeader,
  d as TableMolecule,
  i as TableRow
};
//# sourceMappingURL=TableMolecule.js.map
