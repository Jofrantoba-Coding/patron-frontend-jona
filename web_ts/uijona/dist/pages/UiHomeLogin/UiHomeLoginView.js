import { jsx as o } from "react/jsx-runtime";
import { LoginOrganismView as g } from "../../organisms/LoginOrganism/LoginOrganismView.js";
import { BorderLayoutView as h } from "../../layouts/BorderLayout/BorderLayoutView.js";
const V = ({
  email: r,
  password: e,
  emailError: i,
  passwordError: t,
  alertMessage: n,
  isLoading: m,
  setEmail: s,
  setPassword: a,
  onSubmit: p,
  onGoToCreateAccount: c,
  onGoToRecoverPassword: l,
  appTitle: d,
  footerText: f
}) => /* @__PURE__ */ o(
  h,
  {
    north: /* @__PURE__ */ o("span", { className: "font-semibold text-lg", children: d }),
    south: /* @__PURE__ */ o("span", { children: f }),
    center: /* @__PURE__ */ o(
      g,
      {
        email: r,
        password: e,
        emailError: i,
        passwordError: t,
        alertMessage: n,
        isLoading: m,
        setEmail: s,
        setPassword: a,
        onSubmit: p,
        onGoToCreateAccount: c,
        onGoToRecoverPassword: l
      }
    )
  }
);
export {
  V as UiHomeLoginView
};
//# sourceMappingURL=UiHomeLoginView.js.map
