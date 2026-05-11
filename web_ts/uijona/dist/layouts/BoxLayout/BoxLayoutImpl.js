import { jsx as m } from "react/jsx-runtime";
import e from "react";
import { BOX_LAYOUT_DEFAULTS as r } from "./InterBoxLayout.js";
import { BoxLayoutView as n } from "./BoxLayoutView.js";
const c = e.forwardRef(
  (o, i) => {
    const t = o.direction ?? r.direction, a = o.wrap ?? (t === "column" ? "nowrap" : r.wrap);
    return /* @__PURE__ */ m(
      n,
      {
        ref: i,
        ...r,
        ...o,
        direction: t,
        wrap: a
      }
    );
  }
);
c.displayName = "BoxLayout";
export {
  c as BoxLayoutImpl
};
//# sourceMappingURL=BoxLayoutImpl.js.map
