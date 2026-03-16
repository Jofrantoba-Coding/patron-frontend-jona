import { jsx as v } from "react/jsx-runtime";
import { useState as r } from "react";
import { UI_HOME_CREATE_ACCOUNT_DEFAULTS as H } from "./InterUiHomeCreateAccount.js";
import { UiHomeCreateAccountView as I } from "./UiHomeCreateAccountView.js";
const F = (e) => {
  const o = { ...H, ...e }, [c, f] = r(""), [m, u] = r(""), [s, w] = r(""), [d, g] = r(""), [P, T] = r(o.nameError), [C, A] = r(o.emailError), [L, p] = r(o.passwordError), [U, h] = r(o.confirmPasswordError), [x, E] = r(o.alertMessage), [y, l] = r(o.isLoading);
  function M() {
    const n = c ? "" : "Full name is required", t = m ? "" : "Email is required", a = s ? s.length < 6 ? "Password must be at least 6 characters" : "" : "Password is required", i = d ? d !== s ? "Passwords do not match" : "" : "Please confirm your password";
    return T(n), A(t), p(a), h(i), !n && !t && !a && !i;
  }
  async function _(n) {
    var t;
    if (n.preventDefault(), !!M()) {
      l(!0), E("");
      try {
        await ((t = e.onCreateAccount) == null ? void 0 : t.call(e, c, m, s));
      } catch (a) {
        const i = a instanceof Error ? a.message : "Registration failed";
        E(i);
      } finally {
        l(!1);
      }
    }
  }
  const q = {
    name: c,
    email: m,
    password: s,
    confirmPassword: d,
    nameError: P,
    emailError: C,
    passwordError: L,
    confirmPasswordError: U,
    alertMessage: x,
    isLoading: y,
    setName: f,
    setEmail: u,
    setPassword: w,
    setConfirmPassword: g,
    onSubmit: _,
    onGoToLogin: e.onGoToLogin,
    appTitle: o.appTitle,
    footerText: o.footerText
  };
  return /* @__PURE__ */ v(I, { ...q });
};
export {
  F as UiHomeCreateAccountImpl
};
//# sourceMappingURL=UiHomeCreateAccountImpl.js.map
