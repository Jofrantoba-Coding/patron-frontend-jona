import { jsx as u } from "react/jsx-runtime";
import { useEffect as f } from "react";
import { ToastMoleculeView as o } from "./ToastMoleculeView.js";
const p = ({ id: t, duration: r = 4e3, onDismiss: e, ...l }) => (f(() => {
  if (!r) return;
  const c = setTimeout(() => e == null ? void 0 : e(t), r);
  return () => clearTimeout(c);
}, [t, r, e]), /* @__PURE__ */ u(o, { id: t, ...l, onDismissClick: () => e == null ? void 0 : e(t) }));
p.displayName = "ToastMolecule";
export {
  p as ToastMoleculeImpl
};
//# sourceMappingURL=ToastMoleculeImpl.js.map
