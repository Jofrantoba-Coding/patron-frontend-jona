import { jsx as m } from "react/jsx-runtime";
import { useState as d } from "react";
import { JACCORDION_DEFAULTS as p } from "./InterJAccordion.js";
import { JAccordionView as f } from "./JAccordionView.js";
function a(o) {
  return o ? Array.isArray(o) ? o : [o] : [];
}
const g = (o) => {
  const e = { ...p, ...o }, [i, u] = d(a(e.defaultValue)), r = e.value !== void 0 ? a(e.value) : i, c = (n) => {
    var t;
    const l = e.multiple ? n : n[0] ?? "";
    (t = e.onValueChange) == null || t.call(e, l);
  };
  return /* @__PURE__ */ m(
    f,
    {
      ...e,
      openValues: r,
      onItemToggle: (n) => {
        if (n.disabled) return;
        const l = r.includes(n.value), t = e.multiple ? l ? r.filter((s) => s !== n.value) : [...r, n.value] : l ? [] : [n.value];
        e.value === void 0 && u(t), c(t);
      }
    }
  );
};
g.displayName = "JAccordion";
export {
  g as JAccordionImpl
};
//# sourceMappingURL=JAccordionImpl.js.map
