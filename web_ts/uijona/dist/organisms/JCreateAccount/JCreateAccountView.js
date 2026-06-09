import { jsxs as a, jsx as e } from "react/jsx-runtime";
import { JCardImpl as I, CardHeaderImpl as v, CardTitleImpl as b, CardDescriptionImpl as J, CardContentImpl as F, CardFooterImpl as q } from "../../molecules/JCard/JCardImpl.js";
import { JAlertImpl as N } from "../../molecules/JAlert/JAlertImpl.js";
import { JFormFieldImpl as l } from "../../molecules/JFormField/JFormFieldImpl.js";
import { JButtonImpl as i } from "../../atoms/JButton/JButtonImpl.js";
const D = ({
  name: d,
  email: n,
  password: m,
  confirmPassword: s,
  nameError: c,
  emailError: p,
  passwordError: u,
  confirmPasswordError: h,
  alertMessage: t,
  isLoading: C,
  setName: f,
  setEmail: g,
  setPassword: x,
  setConfirmPassword: w,
  onSubmit: y,
  onGoToLogin: o
}) => /* @__PURE__ */ a(I, { className: "w-full max-w-sm mx-auto", children: [
  /* @__PURE__ */ a(v, { children: [
    /* @__PURE__ */ e(b, { children: "Create account" }),
    /* @__PURE__ */ e(J, { children: "Fill in your details to get started" })
  ] }),
  /* @__PURE__ */ a(F, { children: [
    t && /* @__PURE__ */ e(N, { variant: "danger", title: "Error", className: "mb-4", children: t }),
    /* @__PURE__ */ a("form", { className: "space-y-4", onSubmit: y, noValidate: !0, children: [
      /* @__PURE__ */ e(
        l,
        {
          id: "txtName",
          label: "Full name",
          type: "text",
          value: d,
          onChange: (r) => f(r),
          placeholder: "John Doe",
          errorMessage: c,
          required: !0
        }
      ),
      /* @__PURE__ */ e(
        l,
        {
          id: "txtCreateEmail",
          label: "Email",
          type: "email",
          value: n,
          onChange: (r) => g(r),
          placeholder: "you@example.com",
          errorMessage: p,
          required: !0
        }
      ),
      /* @__PURE__ */ e(
        l,
        {
          id: "txtCreatePassword",
          label: "Password",
          type: "password",
          value: m,
          onChange: (r) => x(r),
          placeholder: "••••••••",
          errorMessage: u,
          required: !0
        }
      ),
      /* @__PURE__ */ e(
        l,
        {
          id: "txtConfirmPassword",
          label: "Confirm password",
          type: "password",
          value: s,
          onChange: (r) => w(r),
          placeholder: "••••••••",
          errorMessage: h,
          required: !0
        }
      ),
      /* @__PURE__ */ e(i, { type: "submit", fullWidth: !0, loading: C, children: "Create account" })
    ] })
  ] }),
  /* @__PURE__ */ e(q, { children: o && /* @__PURE__ */ e(i, { variant: "ghost", fullWidth: !0, onClick: o, children: "Already have an account? Sign in" }) })
] });
export {
  D as JCreateAccountView
};
//# sourceMappingURL=JCreateAccountView.js.map
