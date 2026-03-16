import { jsx as e, jsxs as r } from "react/jsx-runtime";
import { CardMoleculeImpl as g, CardHeaderImpl as C, CardTitleImpl as x, CardDescriptionImpl as y, CardContentImpl as I, CardFooterImpl as v } from "../../molecules/CardMolecule/CardMoleculeImpl.js";
import { AlertMoleculeImpl as w } from "../../molecules/AlertMolecule/AlertMoleculeImpl.js";
import { FormFieldMoleculeImpl as m } from "../../molecules/FormFieldMolecule/FormFieldMoleculeImpl.js";
import { ButtonAtomImpl as i } from "../../atoms/ButtonAtom/ButtonAtomImpl.js";
const j = ({
  email: n,
  password: d,
  emailError: c,
  passwordError: s,
  alertMessage: t,
  isLoading: p,
  setEmail: u,
  setPassword: h,
  onSubmit: f,
  onGoToCreateAccount: a,
  onGoToRecoverPassword: o
}) => /* @__PURE__ */ e("div", { className: "flex items-center justify-center min-h-full py-8 px-4", children: /* @__PURE__ */ r(g, { className: "w-full max-w-sm", children: [
  /* @__PURE__ */ r(C, { children: [
    /* @__PURE__ */ e(x, { children: "Sign in" }),
    /* @__PURE__ */ e(y, { children: "Enter your credentials to access your account" })
  ] }),
  /* @__PURE__ */ r(I, { children: [
    t && /* @__PURE__ */ e(w, { variant: "destructive", title: "Error", className: "mb-4", children: t }),
    /* @__PURE__ */ r("form", { className: "space-y-4", onSubmit: f, noValidate: !0, children: [
      /* @__PURE__ */ e(
        m,
        {
          id: "txtEmail",
          label: "Email",
          type: "email",
          value: n,
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
          value: d,
          onChange: (l) => h(l),
          placeholder: "••••••••",
          errorMessage: s,
          required: !0
        }
      ),
      /* @__PURE__ */ e(i, { type: "submit", fullWidth: !0, loading: p, children: "Sign in" })
    ] })
  ] }),
  /* @__PURE__ */ r(v, { className: "flex-col gap-2", children: [
    a && /* @__PURE__ */ e(i, { variant: "ghost", fullWidth: !0, onClick: a, children: "Create account" }),
    o && /* @__PURE__ */ e(i, { variant: "link", fullWidth: !0, onClick: o, children: "Forgot password?" })
  ] })
] }) });
export {
  j as LoginOrganismView
};
//# sourceMappingURL=LoginOrganismView.js.map
