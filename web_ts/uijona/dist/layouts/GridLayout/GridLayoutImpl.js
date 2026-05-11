import { jsx as r } from "react/jsx-runtime";
import m from "react";
import { GRID_LAYOUT_DEFAULTS as a } from "./InterGridLayout.js";
import { GridLayoutView as d } from "./GridLayoutView.js";
const e = m.forwardRef(
  (o, t) => {
    const i = { ...a, ...o };
    return o.columns !== void 0 && o.autoFitMin === void 0 && (i.autoFitMin = void 0), /* @__PURE__ */ r(d, { ref: t, ...i });
  }
);
e.displayName = "GridLayout";
export {
  e as GridLayoutImpl
};
//# sourceMappingURL=GridLayoutImpl.js.map
