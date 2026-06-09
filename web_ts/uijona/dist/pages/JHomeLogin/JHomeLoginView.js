import { jsx as o } from "react/jsx-runtime";
import { JLoginView as s } from "../../organisms/JLogin/JLoginView.js";
import { JHeaderPageView as x } from "../../organisms/JHeaderPage/JHeaderPageView.js";
import { JFooterPageView as L } from "../../organisms/JFooterPage/JFooterPageView.js";
import { JBorderLayoutView as c } from "../../layouts/JBorderLayout/JBorderLayoutView.js";
const j = ({
  email: e,
  password: r,
  emailError: t,
  passwordError: i,
  alertMessage: m,
  isLoading: p,
  setEmail: f,
  setPassword: n,
  onSubmit: w,
  onGoToCreateAccount: J,
  onGoToRecoverPassword: V,
  appTitle: a,
  footerText: g
}) => /* @__PURE__ */ o(
  c,
  {
    north: /* @__PURE__ */ o(x, { title: a }),
    south: /* @__PURE__ */ o(L, { text: g }),
    center: /* @__PURE__ */ o(
      s,
      {
        email: e,
        password: r,
        emailError: t,
        passwordError: i,
        alertMessage: m,
        isLoading: p,
        setEmail: f,
        setPassword: n,
        onSubmit: w,
        onGoToCreateAccount: J,
        onGoToRecoverPassword: V
      }
    )
  }
);
export {
  j as JHomeLoginView
};
//# sourceMappingURL=JHomeLoginView.js.map
