import { jsx as o } from "react/jsx-runtime";
import { LoginOrganismView as x } from "../../organisms/LoginOrganism/LoginOrganismView.js";
import { HeaderPageOrganismView as L } from "../../organisms/HeaderPageOrganism/HeaderPageOrganismView.js";
import { FooterPageOrganismView as O } from "../../organisms/FooterPageOrganism/FooterPageOrganismView.js";
import { BorderLayoutView as c } from "../../layouts/BorderLayout/BorderLayoutView.js";
const j = ({
  email: r,
  password: e,
  emailError: i,
  passwordError: t,
  alertMessage: m,
  isLoading: n,
  setEmail: a,
  setPassword: g,
  onSubmit: p,
  onGoToCreateAccount: s,
  onGoToRecoverPassword: f,
  appTitle: w,
  footerText: V
}) => /* @__PURE__ */ o(
  c,
  {
    north: /* @__PURE__ */ o(L, { title: w }),
    south: /* @__PURE__ */ o(O, { text: V }),
    center: /* @__PURE__ */ o(
      x,
      {
        email: r,
        password: e,
        emailError: i,
        passwordError: t,
        alertMessage: m,
        isLoading: n,
        setEmail: a,
        setPassword: g,
        onSubmit: p,
        onGoToCreateAccount: s,
        onGoToRecoverPassword: f
      }
    )
  }
);
export {
  j as UiHomeLoginView
};
//# sourceMappingURL=UiHomeLoginView.js.map
