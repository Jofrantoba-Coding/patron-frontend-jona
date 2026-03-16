import { jsx as r } from "react/jsx-runtime";
import { SWITCH_ATOM_DEFAULTS as i } from "./InterSwitchAtom.js";
import { SwitchAtomView as p } from "./SwitchAtomView.js";
const s = ({
  onCheckedChange: t,
  ...o
}) => {
  const m = { ...i, ...o };
  return /* @__PURE__ */ r(
    p,
    {
      ...m,
      onClick: () => t == null ? void 0 : t(!m.checked)
    }
  );
};
s.displayName = "SwitchAtom";
export {
  s as SwitchAtomImpl
};
//# sourceMappingURL=SwitchAtomImpl.js.map
