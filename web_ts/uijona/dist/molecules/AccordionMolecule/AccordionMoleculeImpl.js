import { jsx as m } from "react/jsx-runtime";
import { useState as d } from "react";
import { ACCORDION_MOLECULE_DEFAULTS as p } from "./InterAccordionMolecule.js";
import { AccordionMoleculeView as f } from "./AccordionMoleculeView.js";
function a(n) {
  return n ? Array.isArray(n) ? n : [n] : [];
}
const g = (n) => {
  const e = { ...p, ...n }, [u, c] = d(a(e.defaultValue)), t = e.value !== void 0 ? a(e.value) : u, i = (o) => {
    var l;
    const r = e.multiple ? o : o[0] ?? "";
    (l = e.onValueChange) == null || l.call(e, r);
  };
  return /* @__PURE__ */ m(f, { ...e, openValues: t, onItemToggle: (o) => {
    if (o.disabled) return;
    const r = t.includes(o.value), l = e.multiple ? r ? t.filter((s) => s !== o.value) : [...t, o.value] : r ? [] : [o.value];
    e.value === void 0 && c(l), i(l);
  } });
};
g.displayName = "AccordionMolecule";
export {
  g as AccordionMoleculeImpl
};
//# sourceMappingURL=AccordionMoleculeImpl.js.map
