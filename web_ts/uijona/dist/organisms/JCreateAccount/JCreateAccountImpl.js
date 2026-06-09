import { jsx as N } from "react/jsx-runtime";
import { useState as s } from "react";
import { JCREATE_ACCOUNT_DEFAULTS as u } from "./InterJCreateAccount.js";
import { JCreateAccountView as v } from "./JCreateAccountView.js";
const U = (t) => {
  const n = {
    ...u,
    ...t
  }, [e, a] = s(""), [o, m] = s(""), [r, i] = s(""), [c, d] = s(""), l = t.name !== void 0 ? t.name : e, w = t.email !== void 0 ? t.email : o, f = t.password !== void 0 ? t.password : r, P = t.confirmPassword !== void 0 ? t.confirmPassword : c, C = t.setName ?? a, E = t.setEmail ?? m, A = t.setPassword ?? i, I = t.setConfirmPassword ?? d;
  return /* @__PURE__ */ N(
    v,
    {
      ...n,
      name: l,
      email: w,
      password: f,
      confirmPassword: P,
      setName: C,
      setEmail: E,
      setPassword: A,
      setConfirmPassword: I
    }
  );
};
export {
  U as JCreateAccountImpl
};
//# sourceMappingURL=JCreateAccountImpl.js.map
