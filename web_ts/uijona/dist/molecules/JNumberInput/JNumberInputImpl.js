import { jsx as k } from "react/jsx-runtime";
import E, { useState as F } from "react";
import { JNUMBER_INPUT_DEFAULTS as b } from "./InterJNumberInput.js";
import { JNumberInputView as T } from "./JNumberInputView.js";
const d = (u, e, s) => {
  let t = u;
  return e !== void 0 && (t = Math.max(e, t)), s !== void 0 && (t = Math.min(s, t)), t;
}, m = (u) => {
  if (u.trim() === "") return null;
  const e = Number(u);
  return Number.isFinite(e) ? e : null;
}, _ = E.forwardRef(
  ({ value: u, defaultValue: e = null, min: s, max: t, step: f, onValueChange: i, onIncrement: c, onDecrement: a, onBlur: p, ...v }, J) => {
    const R = { ...b, ...v, min: s, max: t, step: f }, [w, y] = F(e), N = u !== void 0, o = N ? u : w, M = o ?? "", V = o ?? 0, n = (r, l) => {
      N || y(r), i == null || i(r, l);
    }, I = f ?? b.step, S = o === null || s === void 0 || o > s, U = o === null || t === void 0 || o < t;
    return /* @__PURE__ */ k(
      T,
      {
        ...R,
        displayValue: String(M),
        forwardedRef: J,
        canDecrement: S,
        canIncrement: U,
        onInputChange: (r) => {
          const l = m(r.target.value);
          n(l === null ? null : d(l, s, t), r);
        },
        onInputBlur: (r) => p == null ? void 0 : p(m(r.target.value), r),
        onDecrementClick: (r) => {
          const l = d(V - I, s, t);
          n(l, r), a == null || a(l);
        },
        onIncrementClick: (r) => {
          const l = d(V + I, s, t);
          n(l, r), c == null || c(l);
        }
      }
    );
  }
);
_.displayName = "JNumberInput";
export {
  _ as JNumberInputImpl
};
//# sourceMappingURL=JNumberInputImpl.js.map
