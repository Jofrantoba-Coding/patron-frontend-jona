import { jsx as y } from "react/jsx-runtime";
import N, { useState as a } from "react";
import { JSEARCH_INPUT_DEFAULTS as r } from "./InterJSearchInput.js";
import { JSearchInputView as x } from "./JSearchInputView.js";
const A = N.forwardRef(
  ({ value: f, defaultValue: w = "", onChange: m, onSearch: i, onClear: u, onBlur: I, onEnterPress: d, ...J }, R) => {
    const V = { ...r, ...J }, [c, l] = a(w), p = f ?? c, k = (t, s) => {
      f === void 0 && l(t), m == null || m(t, s);
    };
    return /* @__PURE__ */ y(
      x,
      {
        ...V,
        inputValue: p,
        forwardedRef: R,
        onInputChange: (t) => k(t.target.value, t),
        onInputBlur: (t) => I == null ? void 0 : I(t.target.value, t),
        onInputKeyDown: (t) => {
          t.key === "Enter" && (d == null || d(p, t), i == null || i(p, t));
        },
        onClearClick: () => {
          f === void 0 && l(""), u == null || u();
        },
        onSearchClick: (t) => i == null ? void 0 : i(p, t)
      }
    );
  }
);
A.displayName = "JSearchInput";
export {
  A as JSearchInputImpl
};
//# sourceMappingURL=JSearchInputImpl.js.map
