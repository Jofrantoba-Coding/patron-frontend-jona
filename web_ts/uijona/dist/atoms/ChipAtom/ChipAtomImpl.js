import { jsx as s } from "react/jsx-runtime";
import { useState as c } from "react";
import { CHIP_ATOM_DEFAULTS as o } from "./InterChipAtom.js";
import { ChipAtomView as n } from "./ChipAtomView.js";
const a = ({ selected: t, onClick: e, ...r }) => {
  const [i, p] = c(t ?? o.selected), m = t ?? i;
  return /* @__PURE__ */ s(
    n,
    {
      ...o,
      ...r,
      selected: m,
      onClick: (l) => {
        p(!m), e == null || e(l);
      }
    }
  );
};
a.displayName = "ChipAtom";
export {
  a as ChipAtomImpl
};
//# sourceMappingURL=ChipAtomImpl.js.map
