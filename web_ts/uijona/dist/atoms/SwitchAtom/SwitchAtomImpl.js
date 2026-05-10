import { jsx as m } from "react/jsx-runtime";
import { useState as l } from "react";
import { SWITCH_ATOM_DEFAULTS as s } from "./InterSwitchAtom.js";
import { SwitchAtomView as d } from "./SwitchAtomView.js";
const f = ({
  onCheckedChange: t,
  ...i
}) => {
  const e = { ...s, ...i }, [r, o] = l(e.checked), c = i.checked ?? r;
  return /* @__PURE__ */ m(
    d,
    {
      ...e,
      checked: c,
      onClick: () => {
        e.disabled || (o(!c), t == null || t(!c));
      }
    }
  );
};
f.displayName = "SwitchAtom";
export {
  f as SwitchAtomImpl
};
//# sourceMappingURL=SwitchAtomImpl.js.map
