import { jsx as a } from "react/jsx-runtime";
import { useState as l } from "react";
import { JSWITCHFIELD_DEFAULTS as o } from "./InterJSwitchField.js";
import { JSwitchFieldView as C } from "./JSwitchFieldView.js";
const m = (e) => {
  const t = e.checked !== void 0, [i, h] = l(!1), d = t ? e.checked : i;
  return /* @__PURE__ */ a(
    C,
    {
      ...o,
      ...e,
      checked: d,
      onCheckedChange: (n) => {
        var c;
        t || h(n), (c = e.onCheckedChange) == null || c.call(e, n);
      }
    }
  );
};
m.displayName = "JSwitchField";
export {
  m as JSwitchFieldImpl
};
//# sourceMappingURL=JSwitchFieldImpl.js.map
