import { jsx as o } from "react/jsx-runtime";
import { JRecoverPasswordView as J } from "../../organisms/JRecoverPassword/JRecoverPasswordView.js";
import { JHeaderPageView as V } from "../../organisms/JHeaderPage/JHeaderPageView.js";
import { JFooterPageView as c } from "../../organisms/JFooterPage/JFooterPageView.js";
import { JBorderLayoutView as d } from "../../layouts/JBorderLayout/JBorderLayoutView.js";
const u = ({
  email: e,
  emailError: r,
  alertMessage: t,
  successMessage: i,
  isLoading: m,
  setEmail: s,
  onSubmit: w,
  onGoToLogin: a,
  appTitle: p,
  footerText: f
}) => /* @__PURE__ */ o(
  d,
  {
    north: /* @__PURE__ */ o(V, { title: p }),
    south: /* @__PURE__ */ o(c, { text: f }),
    center: /* @__PURE__ */ o(
      J,
      {
        email: e,
        emailError: r,
        alertMessage: t,
        successMessage: i,
        isLoading: m,
        setEmail: s,
        onSubmit: w,
        onGoToLogin: a
      }
    )
  }
);
export {
  u as JHomeRecoverPasswordView
};
//# sourceMappingURL=JHomeRecoverPasswordView.js.map
