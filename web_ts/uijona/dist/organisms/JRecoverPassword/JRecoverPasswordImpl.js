import { jsx as a } from "react/jsx-runtime";
import { useState as s } from "react";
import { JRECOVER_PASSWORD_DEFAULTS as l } from "./InterJRecoverPassword.js";
import { JRecoverPasswordView as n } from "./JRecoverPasswordView.js";
const f = (e) => {
  const t = {
    ...l,
    ...e
  }, [m, o] = s(""), r = e.email !== void 0 ? e.email : m, i = e.setEmail ?? o;
  return /* @__PURE__ */ a(
    n,
    {
      ...t,
      email: r,
      setEmail: i
    }
  );
};
export {
  f as JRecoverPasswordImpl
};
//# sourceMappingURL=JRecoverPasswordImpl.js.map
