import { jsx as v } from "react/jsx-runtime";
import { useState as t } from "react";
import { JHOME_RECOVER_PASSWORD_DEFAULTS as L } from "./InterJHomeRecoverPassword.js";
import { JHomeRecoverPasswordView as R } from "./JHomeRecoverPasswordView.js";
const A = (o) => {
  const e = { ...L, ...o }, [r, l] = t(""), [g, f] = t(e.emailError), [u, n] = t(e.alertMessage), [E, i] = t(e.successMessage), [d, a] = t(e.isLoading);
  function w() {
    const s = r ? "" : "Email is required";
    return f(s), !s;
  }
  async function M(s) {
    var c;
    if (s.preventDefault(), !!w()) {
      a(!0), n(""), i("");
      try {
        await ((c = o.onRecover) == null ? void 0 : c.call(o, r)), i("Check your inbox for the reset link.");
      } catch (m) {
        const T = m instanceof Error ? m.message : "Something went wrong";
        n(T);
      } finally {
        a(!1);
      }
    }
  }
  const S = {
    email: r,
    emailError: g,
    alertMessage: u,
    successMessage: E,
    isLoading: d,
    setEmail: l,
    onSubmit: M,
    onGoToLogin: o.onGoToLogin,
    appTitle: e.appTitle,
    footerText: e.footerText
  };
  return /* @__PURE__ */ v(R, { ...S });
};
export {
  A as JHomeRecoverPasswordImpl
};
//# sourceMappingURL=JHomeRecoverPasswordImpl.js.map
