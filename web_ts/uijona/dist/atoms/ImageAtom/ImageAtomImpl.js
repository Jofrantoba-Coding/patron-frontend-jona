import { jsx as w } from "react/jsx-runtime";
import s from "react";
import { IMAGE_ATOM_DEFAULTS as x } from "./InterImageAtom.js";
import { ImageAtomView as C } from "./ImageAtomView.js";
const M = s.forwardRef(
  ({ src: i, fallbackSrc: t, onError: e, onImageError: m, ...A }, d) => {
    const [p, f] = s.useState(i);
    s.useEffect(() => {
      f(i);
    }, [i]);
    const c = s.useCallback(
      (u) => {
        t && p !== t && f(t), m == null || m(u), e == null || e(u);
      },
      [p, t, e, m]
    );
    return /* @__PURE__ */ w(
      C,
      {
        ref: d,
        ...x,
        ...A,
        src: p,
        onError: c
      }
    );
  }
);
M.displayName = "ImageAtom";
export {
  M as ImageAtomImpl
};
//# sourceMappingURL=ImageAtomImpl.js.map
