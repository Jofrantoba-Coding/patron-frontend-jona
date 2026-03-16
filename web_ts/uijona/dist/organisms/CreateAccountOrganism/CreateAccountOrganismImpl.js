import { jsx as N } from "react/jsx-runtime";
import { useState as t } from "react";
import { CREATE_ACCOUNT_ORGANISM_DEFAULTS as u } from "./InterCreateAccountOrganism.js";
import { CreateAccountOrganismView as v } from "./CreateAccountOrganismView.js";
const _ = (s) => {
  const n = {
    ...u,
    ...s
  }, [a, e] = t(""), [o, m] = t(""), [r, i] = t(""), [c, d] = t(""), l = s.name !== void 0 ? s.name : a, w = s.email !== void 0 ? s.email : o, f = s.password !== void 0 ? s.password : r, P = s.confirmPassword !== void 0 ? s.confirmPassword : c, C = s.setName ?? e, E = s.setEmail ?? m, A = s.setPassword ?? i, I = s.setConfirmPassword ?? d;
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
  _ as CreateAccountOrganismImpl
};
//# sourceMappingURL=CreateAccountOrganismImpl.js.map
