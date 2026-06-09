import { jsx as c } from "react/jsx-runtime";
import { useState as f } from "react";
import { JSTEPPER_DEFAULTS as J } from "./InterJStepper.js";
import { JStepperView as d } from "./JStepperView.js";
const n = ({
  currentStep: m,
  defaultStep: o = 0,
  onStepChange: t,
  ...e
}) => {
  const r = { ...J, ...e }, [p, a] = f(o), l = Math.min(
    Math.max(m ?? p, 0),
    Math.max(r.steps.length - 1, 0)
  );
  return /* @__PURE__ */ c(
    d,
    {
      ...r,
      activeStep: l,
      onStepClick: (i) => {
        const s = r.steps[i];
        !s || s.disabled || (m === void 0 && a(i), t == null || t(i, s));
      }
    }
  );
};
n.displayName = "JStepper";
export {
  n as JStepperImpl
};
//# sourceMappingURL=JStepperImpl.js.map
