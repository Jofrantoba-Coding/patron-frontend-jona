import { jsxs as r, jsx as e } from "react/jsx-runtime";
import { JCardImpl as h, CardHeaderImpl as u, CardTitleImpl as f, CardDescriptionImpl as C, CardContentImpl as I, CardFooterImpl as v } from "../../molecules/JCard/JCardImpl.js";
import { JAlertImpl as t } from "../../molecules/JAlert/JAlertImpl.js";
import { JFormFieldImpl as x } from "../../molecules/JFormField/JFormFieldImpl.js";
import { JButtonImpl as m } from "../../atoms/JButton/JButtonImpl.js";
const k = ({
  email: o,
  emailError: d,
  alertMessage: l,
  successMessage: i,
  isLoading: n,
  setEmail: c,
  onSubmit: s,
  onGoToLogin: a
}) => /* @__PURE__ */ r(h, { className: "w-full max-w-sm mx-auto", children: [
  /* @__PURE__ */ r(u, { children: [
    /* @__PURE__ */ e(f, { children: "Recover password" }),
    /* @__PURE__ */ e(C, { children: "Enter your email and we'll send you a reset link" })
  ] }),
  /* @__PURE__ */ r(I, { children: [
    l && /* @__PURE__ */ e(t, { variant: "danger", title: "Error", className: "mb-4", children: l }),
    i && /* @__PURE__ */ e(t, { variant: "success", title: "Email sent", className: "mb-4", children: i }),
    /* @__PURE__ */ r("form", { className: "space-y-4", onSubmit: s, noValidate: !0, children: [
      /* @__PURE__ */ e(
        x,
        {
          id: "txtRecoverEmail",
          label: "Email",
          type: "email",
          value: o,
          onChange: (p) => c(p),
          placeholder: "you@example.com",
          errorMessage: d,
          required: !0
        }
      ),
      /* @__PURE__ */ e(m, { type: "submit", fullWidth: !0, loading: n, children: "Send reset link" })
    ] })
  ] }),
  /* @__PURE__ */ e(v, { children: a && /* @__PURE__ */ e(m, { variant: "ghost", fullWidth: !0, onClick: a, children: "Back to sign in" }) })
] });
export {
  k as JRecoverPasswordView
};
//# sourceMappingURL=JRecoverPasswordView.js.map
