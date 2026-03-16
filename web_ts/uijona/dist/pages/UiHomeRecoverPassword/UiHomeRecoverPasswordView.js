import { jsx as r } from "react/jsx-runtime";
import { RecoverPasswordOrganismView as f } from "../../organisms/RecoverPasswordOrganism/RecoverPasswordOrganismView.js";
import { HeaderPageOrganismView as g } from "../../organisms/HeaderPageOrganism/HeaderPageOrganismView.js";
import { FooterPageOrganismView as V } from "../../organisms/FooterPageOrganism/FooterPageOrganismView.js";
import { BorderLayoutView as c } from "../../layouts/BorderLayout/BorderLayoutView.js";
const u = ({
  email: o,
  emailError: e,
  alertMessage: t,
  successMessage: i,
  isLoading: m,
  setEmail: s,
  onSubmit: a,
  onGoToLogin: w,
  appTitle: n,
  footerText: p
}) => /* @__PURE__ */ r(
  c,
  {
    north: /* @__PURE__ */ r(g, { title: n }),
    south: /* @__PURE__ */ r(V, { text: p }),
    center: /* @__PURE__ */ r(
      f,
      {
        email: o,
        emailError: e,
        alertMessage: t,
        successMessage: i,
        isLoading: m,
        setEmail: s,
        onSubmit: a,
        onGoToLogin: w
      }
    )
  }
);
export {
  u as UiHomeRecoverPasswordView
};
//# sourceMappingURL=UiHomeRecoverPasswordView.js.map
