import { jsx as r } from "react/jsx-runtime";
import m from "react";
import { JGRID_LAYOUT_DEFAULTS as a } from "./InterJGridLayout.js";
import { JGridLayoutView as d } from "./JGridLayoutView.js";
const e = m.forwardRef(
  (o, t) => {
    const i = { ...a, ...o };
    return o.columns !== void 0 && o.autoFitMin === void 0 && (i.autoFitMin = void 0), /* @__PURE__ */ r(d, { ref: t, ...i });
  }
);
e.displayName = "JGridLayout";
export {
  e as JGridLayoutImpl
};
//# sourceMappingURL=JGridLayoutImpl.js.map
