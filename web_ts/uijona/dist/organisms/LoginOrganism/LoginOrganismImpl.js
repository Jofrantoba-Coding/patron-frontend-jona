import { jsx as c } from "react/jsx-runtime";
import { useState as t } from "react";
import { LOGIN_ORGANISM_DEFAULTS as w } from "./InterLoginOrganism.js";
import { LoginOrganismView as g } from "./LoginOrganismView.js";
const O = (s) => {
  const o = { ...w, ...s }, [a, n] = t(""), [e, i] = t(""), m = s.email !== void 0 ? s.email : a, r = s.password !== void 0 ? s.password : e, l = s.setEmail ?? n, d = s.setPassword ?? i;
  return /* @__PURE__ */ c(
    g,
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
  O as LoginOrganismImpl
};
//# sourceMappingURL=LoginOrganismImpl.js.map
