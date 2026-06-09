import { jsx as J } from "react/jsx-runtime";
import { useState as r } from "react";
import { JHOME_CREATE_ACCOUNT_DEFAULTS as N } from "./InterJHomeCreateAccount.js";
import { JHomeCreateAccountView as S } from "./JHomeCreateAccountView.js";
const G = (e) => {
  const o = { ...N, ...e }, [c, f] = r(""), [m, u] = r(""), [s, w] = r(""), [d, g] = r(""), [P, T] = r(o.nameError), [C, A] = r(o.emailError), [L, p] = r(o.passwordError), [h, x] = r(o.confirmPasswordError), [y, E] = r(o.alertMessage), [M, l] = r(o.isLoading);
  function q() {
    const n = c ? "" : "Full name is required", t = m ? "" : "Email is required", a = s ? s.length < 6 ? "Password must be at least 6 characters" : "" : "Password is required", i = d ? d !== s ? "Passwords do not match" : "" : "Please confirm your password";
    return T(n), A(t), p(a), x(i), !n && !t && !a && !i;
  }
  async function v(n) {
    var t;
    if (n.preventDefault(), !!q()) {
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
  const H = {
    name: c,
    email: m,
    password: s,
    confirmPassword: d,
    nameError: P,
    emailError: C,
    passwordError: L,
    confirmPasswordError: h,
    alertMessage: y,
    isLoading: M,
    setName: f,
    setEmail: u,
    setPassword: w,
    setConfirmPassword: g,
    onSubmit: v,
    onGoToLogin: e.onGoToLogin,
    appTitle: o.appTitle,
    footerText: o.footerText
  };
  return /* @__PURE__ */ J(S, { ...H });
};
export {
  G as JHomeCreateAccountImpl
};
//# sourceMappingURL=JHomeCreateAccountImpl.js.map
