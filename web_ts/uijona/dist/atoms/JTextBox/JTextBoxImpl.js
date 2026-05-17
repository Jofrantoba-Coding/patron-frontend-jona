import { jsx as x } from "react/jsx-runtime";
import c from "react";
import { JTEXTBOX_DEFAULTS as l } from "./InterJTextBox.js";
import { JTextBoxView as r } from "./JTextBoxView.js";
const T = c.forwardRef(
  ({ onChange: a, onBlur: d, onKeyDown: f, onEnterPress: m, onClear: e, ...i }, p) => /* @__PURE__ */ x(
    r,
    {
      ...l,
      ...i,
      forwardedRef: p,
      onChange: (t) => a == null ? void 0 : a(t.target.value, t),
      onBlur: (t) => d == null ? void 0 : d(t.target.value, t),
      onKeyDown: (t) => {
        t.key === "Enter" && (m == null || m(t.target.value, t)), t.key === "Backspace" && t.target.value === "" && (e == null || e()), f == null || f(t);
      }
    }
  )
);
T.displayName = "JTextBox";
export {
  T as JTextBoxImpl
};
//# sourceMappingURL=JTextBoxImpl.js.map
