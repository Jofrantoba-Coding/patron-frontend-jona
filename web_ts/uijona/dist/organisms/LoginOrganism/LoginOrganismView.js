import { jsxs as r, jsx as e } from "react/jsx-runtime";
import { CardMoleculeImpl as g, CardHeaderImpl as C, CardTitleImpl as x, CardDescriptionImpl as I, CardContentImpl as y, CardFooterImpl as w } from "../../molecules/CardMolecule/CardMoleculeImpl.js";
import { AlertMoleculeImpl as v } from "../../molecules/AlertMolecule/AlertMoleculeImpl.js";
import { FormFieldMoleculeImpl as m } from "../../molecules/FormFieldMolecule/FormFieldMoleculeImpl.js";
import { ButtonAtomImpl as i } from "../../atoms/ButtonAtom/ButtonAtomImpl.js";
const k = ({
  email: d,
  password: n,
  emailError: c,
  passwordError: s,
  alertMessage: a,
  isLoading: p,
  setEmail: u,
  setPassword: h,
  onSubmit: f,
  onGoToCreateAccount: t,
  onGoToRecoverPassword: o
}) => /* @__PURE__ */ r(g, { className: "w-full max-w-sm mx-auto", children: [
  /* @__PURE__ */ r(C, { children: [
    /* @__PURE__ */ e(x, { children: "Sign in" }),
    /* @__PURE__ */ e(I, { children: "Enter your credentials to access your account" })
  ] }),
  /* @__PURE__ */ r(y, { children: [
    a && /* @__PURE__ */ e(v, { variant: "destructive", title: "Error", className: "mb-4", children: a }),
    /* @__PURE__ */ r("form", { className: "space-y-4", onSubmit: f, noValidate: !0, children: [
      /* @__PURE__ */ e(
        m,
        {
          id: "txtEmail",
          label: "Email",
          type: "email",
          value: d,
          onChange: (l) => u(l),
          placeholder: "you@example.com",
          errorMessage: c,
          required: !0
        }
      ),
      /* @__PURE__ */ e(
        m,
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
      /* @__PURE__ */ e(i, { type: "submit", fullWidth: !0, loading: p, children: "Sign in" })
    ] })
  ] }),
  /* @__PURE__ */ r(w, { className: "flex-col gap-2", children: [
    t && /* @__PURE__ */ e(i, { variant: "ghost", fullWidth: !0, onClick: t, children: "Create account" }),
    o && /* @__PURE__ */ e(i, { variant: "link", fullWidth: !0, onClick: o, children: "Forgot password?" })
  ] })
] });
export {
  k as LoginOrganismView
};
//# sourceMappingURL=LoginOrganismView.js.map
