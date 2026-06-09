import { jsx as J } from "react/jsx-runtime";
import R from "react";
import { JFORMFIELD_DEFAULTS as h } from "./InterJFormField.js";
import { JFormFieldView as w } from "./JFormFieldView.js";
const E = R.forwardRef(
  ({ onBlur: m, onInvalid: t, onValid: r, errorMessage: e, ...F }, p) => {
    const o = { ...h, ...F }, c = !!e;
    return /* @__PURE__ */ J(
      w,
      {
        ...o,
        errorMessage: e,
        onBlur: (f, s) => {
          m == null || m(f, s), c ? t == null || t(f, e ?? "") : r == null || r(f);
        },
        onValid: r,
        forwardedRef: p
      }
    );
  }
);
E.displayName = "JFormField";
export {
  E as JFormFieldImpl
};
//# sourceMappingURL=JFormFieldImpl.js.map
