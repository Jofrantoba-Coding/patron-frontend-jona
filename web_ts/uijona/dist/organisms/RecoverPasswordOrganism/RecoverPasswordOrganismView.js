import { jsxs as r, jsx as e } from "react/jsx-runtime";
import { CardMoleculeImpl as u, CardHeaderImpl as h, CardTitleImpl as f, CardDescriptionImpl as C, CardContentImpl as I, CardFooterImpl as v } from "../../molecules/CardMolecule/CardMoleculeImpl.js";
import { AlertMoleculeImpl as a } from "../../molecules/AlertMolecule/AlertMoleculeImpl.js";
import { FormFieldMoleculeImpl as x } from "../../molecules/FormFieldMolecule/FormFieldMoleculeImpl.js";
import { ButtonAtomImpl as m } from "../../atoms/ButtonAtom/ButtonAtomImpl.js";
const N = ({
  email: o,
  emailError: d,
  alertMessage: l,
  successMessage: i,
  isLoading: n,
  setEmail: c,
  onSubmit: s,
  onGoToLogin: t
}) => /* @__PURE__ */ r(u, { className: "w-full max-w-sm mx-auto", children: [
  /* @__PURE__ */ r(h, { children: [
    /* @__PURE__ */ e(f, { children: "Recover password" }),
    /* @__PURE__ */ e(C, { children: "Enter your email and we'll send you a reset link" })
  ] }),
  /* @__PURE__ */ r(I, { children: [
    l && /* @__PURE__ */ e(a, { variant: "destructive", title: "Error", className: "mb-4", children: l }),
    i && /* @__PURE__ */ e(a, { variant: "default", title: "Email sent", className: "mb-4", children: i }),
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
  /* @__PURE__ */ e(v, { children: t && /* @__PURE__ */ e(m, { variant: "ghost", fullWidth: !0, onClick: t, children: "Back to sign in" }) })
] });
export {
  N as RecoverPasswordOrganismView
};
//# sourceMappingURL=RecoverPasswordOrganismView.js.map
