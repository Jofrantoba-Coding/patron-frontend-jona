import { jsx as a } from "react/jsx-runtime";
import { useState as s } from "react";
import { RECOVER_PASSWORD_ORGANISM_DEFAULTS as n } from "./InterRecoverPasswordOrganism.js";
import { RecoverPasswordOrganismView as l } from "./RecoverPasswordOrganismView.js";
const S = (e) => {
  const m = {
    ...n,
    ...e
  }, [t, r] = s(""), i = e.email !== void 0 ? e.email : t, o = e.setEmail ?? r;
  return /* @__PURE__ */ a(
    l,
    {
      ...m,
      email: i,
      setEmail: o
    }
  );
};
export {
  S as RecoverPasswordOrganismImpl
};
//# sourceMappingURL=RecoverPasswordOrganismImpl.js.map
