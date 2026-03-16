import { jsxs as l, jsx as e } from "react/jsx-runtime";
import { CardMoleculeImpl as I, CardHeaderImpl as v, CardTitleImpl as b, CardDescriptionImpl as M, CardContentImpl as F, CardFooterImpl as q } from "../../molecules/CardMolecule/CardMoleculeImpl.js";
import { AlertMoleculeImpl as A } from "../../molecules/AlertMolecule/AlertMoleculeImpl.js";
import { FormFieldMoleculeImpl as a } from "../../molecules/FormFieldMolecule/FormFieldMoleculeImpl.js";
import { ButtonAtomImpl as i } from "../../atoms/ButtonAtom/ButtonAtomImpl.js";
const V = ({
  name: d,
  email: m,
  password: n,
  confirmPassword: s,
  nameError: c,
  emailError: u,
  passwordError: p,
  confirmPasswordError: h,
  alertMessage: t,
  isLoading: C,
  setName: f,
  setEmail: g,
  setPassword: x,
  setConfirmPassword: w,
  onSubmit: y,
  onGoToLogin: o
}) => /* @__PURE__ */ l(I, { className: "w-full max-w-sm mx-auto", children: [
  /* @__PURE__ */ l(v, { children: [
    /* @__PURE__ */ e(b, { children: "Create account" }),
    /* @__PURE__ */ e(M, { children: "Fill in your details to get started" })
  ] }),
  /* @__PURE__ */ l(F, { children: [
    t && /* @__PURE__ */ e(A, { variant: "destructive", title: "Error", className: "mb-4", children: t }),
    /* @__PURE__ */ l("form", { className: "space-y-4", onSubmit: y, noValidate: !0, children: [
      /* @__PURE__ */ e(
        a,
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
        a,
        {
          id: "txtCreateEmail",
          label: "Email",
          type: "email",
          value: m,
          onChange: (r) => g(r),
          placeholder: "you@example.com",
          errorMessage: u,
          required: !0
        }
      ),
      /* @__PURE__ */ e(
        a,
        {
          id: "txtCreatePassword",
          label: "Password",
          type: "password",
          value: n,
          onChange: (r) => x(r),
          placeholder: "••••••••",
          errorMessage: p,
          required: !0
        }
      ),
      /* @__PURE__ */ e(
        a,
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
  V as CreateAccountOrganismView
};
//# sourceMappingURL=CreateAccountOrganismView.js.map
