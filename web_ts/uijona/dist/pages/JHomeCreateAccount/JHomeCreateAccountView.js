import { jsx as e } from "react/jsx-runtime";
import { JCreateAccountView as h } from "../../organisms/JCreateAccount/JCreateAccountView.js";
import { JHeaderPageView as A } from "../../organisms/JHeaderPage/JHeaderPageView.js";
import { JFooterPageView as C } from "../../organisms/JFooterPage/JFooterPageView.js";
import { JBorderLayoutView as H } from "../../layouts/JBorderLayout/JBorderLayoutView.js";
const F = ({
  name: o,
  email: t,
  password: r,
  confirmPassword: i,
  nameError: m,
  emailError: a,
  passwordError: c,
  confirmPasswordError: p,
  alertMessage: f,
  isLoading: n,
  setName: w,
  setEmail: J,
  setPassword: V,
  setConfirmPassword: u,
  onSubmit: s,
  onGoToLogin: x,
  appTitle: d,
  footerText: g
}) => /* @__PURE__ */ e(
  H,
  {
    north: /* @__PURE__ */ e(A, { title: d }),
    south: /* @__PURE__ */ e(C, { text: g }),
    center: /* @__PURE__ */ e(
      h,
      {
        name: o,
        email: t,
        password: r,
        confirmPassword: i,
        nameError: m,
        emailError: a,
        passwordError: c,
        confirmPasswordError: p,
        alertMessage: f,
        isLoading: n,
        setName: w,
        setEmail: J,
        setPassword: V,
        setConfirmPassword: u,
        onSubmit: s,
        onGoToLogin: x
      }
    )
  }
);
export {
  F as JHomeCreateAccountView
};
//# sourceMappingURL=JHomeCreateAccountView.js.map
