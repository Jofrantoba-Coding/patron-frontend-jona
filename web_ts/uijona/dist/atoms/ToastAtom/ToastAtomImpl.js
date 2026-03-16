import { jsx as p } from "react/jsx-runtime";
import { useEffect as c } from "react";
import { ToastAtomView as m } from "./ToastAtomView.js";
const T = ({ id: e, duration: r = 4e3, onDismiss: t, ...f }) => (c(() => {
  if (!r) return;
  const o = setTimeout(() => t == null ? void 0 : t(e), r);
  return () => clearTimeout(o);
}, [e, r, t]), /* @__PURE__ */ p(m, { id: e, ...f, onDismissClick: () => t == null ? void 0 : t(e) }));
T.displayName = "ToastAtom";
export {
  T as ToastAtomImpl
};
//# sourceMappingURL=ToastAtomImpl.js.map
