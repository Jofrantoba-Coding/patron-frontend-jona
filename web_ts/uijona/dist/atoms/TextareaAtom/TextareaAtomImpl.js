import { jsx as m } from "react/jsx-runtime";
import u, { useRef as p } from "react";
import { TEXTAREA_ATOM_DEFAULTS as h } from "./InterTextareaAtom.js";
import { TextareaAtomView as R } from "./TextareaAtomView.js";
function d(e, r) {
  typeof e == "function" ? e(r) : e && (e.current = r);
}
const n = u.forwardRef(
  ({ onChange: e, onBlur: r, onKeyDown: i, autoResize: s, ...l }, f) => {
    const a = { ...h, autoResize: s, ...l }, c = p(null), o = (t) => {
      a.autoResize && (t.style.height = "auto", t.style.height = `${t.scrollHeight}px`);
    };
    return /* @__PURE__ */ m(
      R,
      {
        ...a,
        forwardedRef: (t) => {
          c.current = t, t && o(t), d(f, t);
        },
        onChange: (t) => {
          o(t.target), e == null || e(t.target.value, t);
        },
        onBlur: (t) => {
          r == null || r(t.target.value, t);
        },
        onKeyDown: i
      }
    );
  }
);
n.displayName = "TextareaAtom";
export {
  n as TextareaAtomImpl
};
//# sourceMappingURL=TextareaAtomImpl.js.map
