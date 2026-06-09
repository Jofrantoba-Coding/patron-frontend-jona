import { jsx as c } from "react/jsx-runtime";
import { useState as s } from "react";
import { JLOGIN_DEFAULTS as w } from "./InterJLogin.js";
import { JLoginView as E } from "./JLoginView.js";
const g = (t) => {
  const o = { ...w, ...t }, [e, a] = s(""), [n, i] = s(""), m = t.email !== void 0 ? t.email : e, r = t.password !== void 0 ? t.password : n, l = t.setEmail ?? a, d = t.setPassword ?? i;
  return /* @__PURE__ */ c(
    E,
    {
      ...o,
      email: m,
      password: r,
      setEmail: l,
      setPassword: d
    }
  );
};
export {
  g as JLoginImpl
};
//# sourceMappingURL=JLoginImpl.js.map
