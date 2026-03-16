import { jsx as r } from "react/jsx-runtime";
import { CreateAccountOrganismView as h } from "../../organisms/CreateAccountOrganism/CreateAccountOrganismView.js";
import { HeaderPageOrganismView as A } from "../../organisms/HeaderPageOrganism/HeaderPageOrganismView.js";
import { FooterPageOrganismView as C } from "../../organisms/FooterPageOrganism/FooterPageOrganismView.js";
import { BorderLayoutView as H } from "../../layouts/BorderLayout/BorderLayoutView.js";
const F = ({
  name: e,
  email: o,
  password: t,
  confirmPassword: i,
  nameError: m,
  emailError: a,
  passwordError: n,
  confirmPasswordError: c,
  alertMessage: p,
  isLoading: s,
  setName: f,
  setEmail: g,
  setPassword: w,
  setConfirmPassword: V,
  onSubmit: u,
  onGoToLogin: x,
  appTitle: O,
  footerText: d
}) => /* @__PURE__ */ r(
  H,
  {
    north: /* @__PURE__ */ r(A, { title: O }),
    south: /* @__PURE__ */ r(C, { text: d }),
    center: /* @__PURE__ */ r(
      h,
      {
        name: e,
        email: o,
        password: t,
        confirmPassword: i,
        nameError: m,
        emailError: a,
        passwordError: n,
        confirmPasswordError: c,
        alertMessage: p,
        isLoading: s,
        setName: f,
        setEmail: g,
        setPassword: w,
        setConfirmPassword: V,
        onSubmit: u,
        onGoToLogin: x
      }
    )
  }
);
export {
  F as UiHomeCreateAccountView
};
//# sourceMappingURL=UiHomeCreateAccountView.js.map
