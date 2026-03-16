import { jsxs as x, jsx as o } from "react/jsx-runtime";
import h from "react";
import { cn as y } from "../lib/cn.js";
import { LabelAtom as b } from "../atoms/LabelAtom.js";
import { SelectAtom as g } from "../atoms/SelectAtom.js";
import { ErrorMessageAtom as c } from "../atoms/ErrorMessageAtom.js";
const A = h.forwardRef(
  ({ id: e, label: s, options: a, groups: f, placeholder: i, errorMessage: t, description: r, required: l, className: p, ...d }, n) => {
    const m = !!t;
    return /* @__PURE__ */ x("div", { className: y("flex flex-col gap-1.5", p), children: [
      /* @__PURE__ */ o(b, { htmlFor: e, required: l, children: s }),
      /* @__PURE__ */ o(g, { ref: n, id: e, options: a, groups: f, placeholder: i, hasError: m, required: l, "aria-describedby": r ? `${e}-desc` : void 0, ...d }),
      r && !m && /* @__PURE__ */ o(c, { id: `${e}-desc`, message: r, type: "description" }),
      m && /* @__PURE__ */ o(c, { message: t, type: "error" })
    ] });
  }
);
A.displayName = "SelectFieldMolecule";
export {
  A as SelectFieldMolecule
};
//# sourceMappingURL=SelectFieldMolecule.js.map
