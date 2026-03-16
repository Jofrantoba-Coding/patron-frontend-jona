import { jsx as x } from "react/jsx-runtime";
import { useState as e } from "react";
import { UI_HOME_LOGIN_DEFAULTS as A } from "./InterUiHomeLogin.js";
import { UiHomeLoginView as I } from "./UiHomeLoginView.js";
const S = (o) => {
  const r = { ...A, ...o }, [a, l] = e(""), [n, d] = e(""), [f, E] = e(r.emailError), [g, u] = e(r.passwordError), [w, i] = e(r.alertMessage), [L, c] = e(r.isLoading);
  function T() {
    const s = a ? "" : "Email is required", t = n ? "" : "Password is required";
    return E(s), u(t), !s && !t;
  }
  async function P(s) {
    var t;
    if (s.preventDefault(), !!T()) {
      c(!0), i("");
      try {
        await ((t = o.onLogin) == null ? void 0 : t.call(o, a, n));
      } catch (m) {
        const G = m instanceof Error ? m.message : "Login failed";
        i(G);
      } finally {
        c(!1);
      }
    }
  }
  const v = {
    email: a,
    password: n,
    emailError: f,
    passwordError: g,
    alertMessage: w,
    isLoading: L,
    setEmail: l,
    setPassword: d,
    onSubmit: P,
    onGoToCreateAccount: o.onGoToCreateAccount,
    onGoToRecoverPassword: o.onGoToRecoverPassword,
    appTitle: r.appTitle,
    footerText: r.footerText
  };
  return /* @__PURE__ */ x(I, { ...v });
};
export {
  S as UiHomeLoginImpl
};
//# sourceMappingURL=UiHomeLoginImpl.js.map
