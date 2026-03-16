import { jsx as v } from "react/jsx-runtime";
import { useState as t } from "react";
import { UI_HOME_RECOVER_PASSWORD_DEFAULTS as L } from "./InterUiHomeRecoverPassword.js";
import { UiHomeRecoverPasswordView as R } from "./UiHomeRecoverPasswordView.js";
const U = (o) => {
  const e = { ...L, ...o }, [r, l] = t(""), [g, f] = t(e.emailError), [u, i] = t(e.alertMessage), [E, n] = t(e.successMessage), [d, a] = t(e.isLoading);
  function w() {
    const s = r ? "" : "Email is required";
    return f(s), !s;
  }
  async function M(s) {
    var c;
    if (s.preventDefault(), !!w()) {
      a(!0), i(""), n("");
      try {
        await ((c = o.onRecover) == null ? void 0 : c.call(o, r)), n("Check your inbox for the reset link.");
      } catch (m) {
        const T = m instanceof Error ? m.message : "Something went wrong";
        i(T);
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
  U as UiHomeRecoverPasswordImpl
};
//# sourceMappingURL=UiHomeRecoverPasswordImpl.js.map
