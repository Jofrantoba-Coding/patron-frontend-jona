import { jsx as E } from "react/jsx-runtime";
import L from "react";
import { FORM_FIELD_MOLECULE_DEFAULTS as R } from "./InterFormFieldMolecule.js";
import { FormFieldMoleculeView as h } from "./FormFieldMoleculeView.js";
const l = L.forwardRef(
  ({ onBlur: r, onInvalid: m, onValid: e, errorMessage: t, ...o }, F) => {
    const c = { ...R, ...o }, p = !!t;
    return /* @__PURE__ */ E(
      h,
      {
        ...c,
        errorMessage: t,
        onBlur: (f, s) => {
          r == null || r(f, s), p ? m == null || m(f, t ?? "") : e == null || e(f);
        },
        onValid: e,
        forwardedRef: F
      }
    );
  }
);
l.displayName = "FormFieldMolecule";
export {
  l as FormFieldMoleculeImpl
};
//# sourceMappingURL=FormFieldMoleculeImpl.js.map
