import { jsxs as x, jsx as m } from "react/jsx-runtime";
import $ from "react";
import { cn as h } from "../lib/cn.js";
import { LabelAtom as w } from "../atoms/LabelAtom.js";
import { InputAtom as L } from "../atoms/InputAtom.js";
import { ErrorMessageAtom as i } from "../atoms/ErrorMessageAtom.js";
const M = $.forwardRef(
  ({ id: e, label: F, errorMessage: t, description: o, orientation: p = "vertical", required: a, className: g, onChange: y, onBlur: c, onFocus: b, onKeyDown: d, onEnterPress: A, onClear: N, onValid: s, onInvalid: f, ...j }, z) => {
    const r = !!t, E = (l, R) => {
      c == null || c(l, R), r ? f == null || f(l, t ?? "") : s == null || s(l);
    };
    return /* @__PURE__ */ x("div", { className: h(p === "horizontal" ? "flex items-center gap-4" : "flex flex-col gap-1.5", g), children: [
      /* @__PURE__ */ m(w, { htmlFor: e, required: a, children: F }),
      /* @__PURE__ */ x("div", { className: h("flex flex-col gap-1", p === "horizontal" && "flex-1"), children: [
        /* @__PURE__ */ m(L, { ref: z, id: e, hasError: r, required: a, "aria-describedby": o ? `${e}-desc` : void 0, onChange: y, onBlur: E, onFocus: b, onKeyDown: d, onEnterPress: A, onClear: N, ...j }),
        o && !r && /* @__PURE__ */ m(i, { id: `${e}-desc`, message: o, type: "description" }),
        r && /* @__PURE__ */ m(i, { message: t, type: "error" })
      ] })
    ] });
  }
);
M.displayName = "FormFieldMolecule";
export {
  M as FormFieldMolecule
};
//# sourceMappingURL=FormFieldMolecule.js.map
