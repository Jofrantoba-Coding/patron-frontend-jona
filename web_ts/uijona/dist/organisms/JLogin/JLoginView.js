import { jsxs as e, jsx as r } from "react/jsx-runtime";
import { JCardImpl as g, CardHeaderImpl as C, CardTitleImpl as x, CardDescriptionImpl as I, CardContentImpl as y, CardFooterImpl as w } from "../../molecules/JCard/JCardImpl.js";
import { JAlertImpl as J } from "../../molecules/JAlert/JAlertImpl.js";
import { JFormFieldImpl as d } from "../../molecules/JFormField/JFormFieldImpl.js";
import { JButtonImpl as a } from "../../atoms/JButton/JButtonImpl.js";
const k = ({
  email: m,
  password: n,
  emailError: c,
  passwordError: s,
  alertMessage: i,
  isLoading: p,
  setEmail: u,
  setPassword: h,
  onSubmit: f,
  onGoToCreateAccount: t,
  onGoToRecoverPassword: o
}) => /* @__PURE__ */ e(g, { className: "w-full max-w-sm mx-auto", children: [
  /* @__PURE__ */ e(C, { children: [
    /* @__PURE__ */ r(x, { children: "Sign in" }),
    /* @__PURE__ */ r(I, { children: "Enter your credentials to access your account" })
  ] }),
  /* @__PURE__ */ e(y, { children: [
    i && /* @__PURE__ */ r(J, { variant: "danger", title: "Error", className: "mb-4", children: i }),
    /* @__PURE__ */ e("form", { className: "space-y-4", onSubmit: f, noValidate: !0, children: [
      /* @__PURE__ */ r(
        d,
        {
          id: "txtEmail",
          label: "Email",
          type: "email",
          value: m,
          onChange: (l) => u(l),
          placeholder: "you@example.com",
          errorMessage: c,
          required: !0
        }
      ),
      /* @__PURE__ */ r(
        d,
        {
          id: "txtPassword",
          label: "Password",
          type: "password",
          value: n,
          onChange: (l) => h(l),
          placeholder: "••••••••",
          errorMessage: s,
          required: !0
        }
      ),
      /* @__PURE__ */ r(a, { type: "submit", fullWidth: !0, loading: p, children: "Sign in" })
    ] })
  ] }),
  /* @__PURE__ */ e(w, { className: "flex-col gap-2", children: [
    t && /* @__PURE__ */ r(a, { variant: "ghost", fullWidth: !0, onClick: t, children: "Create account" }),
    o && /* @__PURE__ */ r(a, { variant: "link", fullWidth: !0, onClick: o, children: "Forgot password?" })
  ] })
] });
export {
  k as JLoginView
};
//# sourceMappingURL=JLoginView.js.map
