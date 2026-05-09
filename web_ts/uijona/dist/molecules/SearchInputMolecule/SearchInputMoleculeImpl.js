import { jsx as o } from "react/jsx-runtime";
import s, { useState as y } from "react";
import { SEARCH_INPUT_MOLECULE_DEFAULTS as L } from "./InterSearchInputMolecule.js";
import { SearchInputMoleculeView as N } from "./SearchInputMoleculeView.js";
const U = s.forwardRef(
  ({ value: u, defaultValue: c = "", onChange: f, onSearch: i, onClear: l, onBlur: m, onEnterPress: I, ...w }, M) => {
    const R = { ...L, ...w }, [V, d] = y(c), p = u ?? V, e = (t, k) => {
      u === void 0 && d(t), f == null || f(t, k);
    };
    return /* @__PURE__ */ o(
      N,
      {
        ...R,
        inputValue: p,
        forwardedRef: M,
        onInputChange: (t) => e(t.target.value, t),
        onInputBlur: (t) => m == null ? void 0 : m(t.target.value, t),
        onInputKeyDown: (t) => {
          t.key === "Enter" && (I == null || I(p, t), i == null || i(p, t));
        },
        onClearClick: () => {
          u === void 0 && d(""), l == null || l();
        },
        onSearchClick: (t) => i == null ? void 0 : i(p, t)
      }
    );
  }
);
U.displayName = "SearchInputMolecule";
export {
  U as SearchInputMoleculeImpl
};
//# sourceMappingURL=SearchInputMoleculeImpl.js.map
