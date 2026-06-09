import { jsx as p } from "react/jsx-runtime";
import { useEffect as o } from "react";
import { JTOAST_DEFAULTS as a } from "./InterJToast.js";
import { JToastView as c } from "./JToastView.js";
const u = ({
  id: r,
  duration: e = a.duration,
  onDismiss: t,
  ...T
}) => (o(() => {
  if (!e) return;
  const f = setTimeout(() => t == null ? void 0 : t(r), e);
  return () => clearTimeout(f);
}, [r, e, t]), /* @__PURE__ */ p(c, { id: r, ...T, onDismissClick: () => t == null ? void 0 : t(r) }));
u.displayName = "JToast";
export {
  u as JToastImpl
};
//# sourceMappingURL=JToastImpl.js.map
