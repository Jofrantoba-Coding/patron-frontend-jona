import { jsx as a } from "react/jsx-runtime";
import { useState as M } from "react";
import { STEPPER_MOLECULE_DEFAULTS as f } from "./InterStepperMolecule.js";
import { StepperMoleculeView as u } from "./StepperMoleculeView.js";
const E = ({
  currentStep: i,
  defaultStep: l = 0,
  onStepChange: t,
  ...s
}) => {
  const e = { ...f, ...s }, [m, p] = M(l), c = Math.min(Math.max(i ?? m, 0), Math.max(e.steps.length - 1, 0));
  return /* @__PURE__ */ a(
    u,
    {
      ...e,
      activeStep: c,
      onStepClick: (r) => {
        const o = e.steps[r];
        !o || o.disabled || (i === void 0 && p(r), t == null || t(r, o));
      }
    }
  );
};
E.displayName = "StepperMolecule";
export {
  E as StepperMoleculeImpl
};
//# sourceMappingURL=StepperMoleculeImpl.js.map
