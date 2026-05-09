import { jsx as S } from "react/jsx-runtime";
import _, { useState as k } from "react";
import { NUMBER_INPUT_MOLECULE_DEFAULTS as I } from "./InterNumberInputMolecule.js";
import { NumberInputMoleculeView as F } from "./NumberInputMoleculeView.js";
const d = (u, s, r) => {
  let t = u;
  return s !== void 0 && (t = Math.max(s, t)), r !== void 0 && (t = Math.min(r, t)), t;
}, b = (u) => {
  if (u.trim() === "") return null;
  const s = Number(u);
  return Number.isFinite(s) ? s : null;
}, T = _.forwardRef(
  ({ value: u, defaultValue: s = null, min: r, max: t, step: f, onValueChange: c, onIncrement: i, onDecrement: a, onBlur: p, ...m }, v) => {
    const E = { ...I, ...m, min: r, max: t, step: f }, [R, U] = k(s), N = u !== void 0, o = N ? u : R, w = o ?? "", V = o ?? 0, n = (l, e) => {
      N || U(l), c == null || c(l, e);
    }, M = f ?? I.step, y = o === null || r === void 0 || o > r, L = o === null || t === void 0 || o < t;
    return /* @__PURE__ */ S(
      F,
      {
        ...E,
        displayValue: String(w),
        forwardedRef: v,
        canDecrement: y,
        canIncrement: L,
        onInputChange: (l) => {
          const e = b(l.target.value);
          n(e === null ? null : d(e, r, t), l);
        },
        onInputBlur: (l) => p == null ? void 0 : p(b(l.target.value), l),
        onDecrementClick: (l) => {
          const e = d(V - M, r, t);
          n(e, l), a == null || a(e);
        },
        onIncrementClick: (l) => {
          const e = d(V + M, r, t);
          n(e, l), i == null || i(e);
        }
      }
    );
  }
);
T.displayName = "NumberInputMolecule";
export {
  T as NumberInputMoleculeImpl
};
//# sourceMappingURL=NumberInputMoleculeImpl.js.map
