import { jsx as u } from "react/jsx-runtime";
import { useState as i } from "react";
import { JRADIO_GROUP_DEFAULTS as p } from "./InterJRadioGroup.js";
import { JRadioGroupView as m } from "./JRadioGroupView.js";
const s = (n) => {
  const e = { ...p, ...n }, [t, l] = i(e.defaultValue), r = e.value ?? t;
  return /* @__PURE__ */ u(
    m,
    {
      ...e,
      selectedValue: r,
      onOptionChange: (a) => {
        var o;
        e.value === void 0 && l(a.value), (o = e.onValueChange) == null || o.call(e, a.value, a);
      }
    }
  );
};
s.displayName = "JRadioGroup";
export {
  s as JRadioGroupImpl
};
//# sourceMappingURL=JRadioGroupImpl.js.map
