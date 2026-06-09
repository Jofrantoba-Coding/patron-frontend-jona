import { jsx as k } from "react/jsx-runtime";
import { useState as a } from "react";
import { JCHECKBOX_FIELD_DEFAULTS as n } from "./InterJCheckBoxField.js";
import { JCheckBoxFieldView as i } from "./JCheckBoxFieldView.js";
const o = (e) => {
  const [d, t] = a(
    e.checked ?? n.checked
  ), C = e.checked ?? d;
  return /* @__PURE__ */ k(
    i,
    {
      ...n,
      ...e,
      checked: C,
      onCheckedChange: (c) => {
        var h;
        t(c), (h = e.onCheckedChange) == null || h.call(e, c);
      }
    }
  );
};
o.displayName = "JCheckBoxField";
export {
  o as JCheckBoxFieldImpl
};
//# sourceMappingURL=JCheckBoxFieldImpl.js.map
