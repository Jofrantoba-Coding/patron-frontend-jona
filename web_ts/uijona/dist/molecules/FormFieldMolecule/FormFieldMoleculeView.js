import { jsxs as s, jsx as l } from "react/jsx-runtime";
import { cn as c } from "../../lib/cn.js";
import { LabelAtomImpl as y } from "../../atoms/LabelAtom/LabelAtomImpl.js";
import { InputAtomImpl as A } from "../../atoms/InputAtom/InputAtomImpl.js";
import { ErrorMessageAtomImpl as i } from "../../atoms/ErrorMessageAtom/ErrorMessageAtomImpl.js";
const w = ({
  id: e,
  label: n,
  errorMessage: m,
  description: o,
  orientation: a = "vertical",
  required: t,
  className: p,
  onChange: f,
  onBlur: d,
  onFocus: x,
  onKeyDown: h,
  onEnterPress: I,
  onClear: v,
  onValid: F,
  onInvalid: j,
  onInvalidInternal: u,
  forwardedRef: g,
  ...b
}) => {
  const r = !!m;
  return /* @__PURE__ */ s("div", { className: c(a === "horizontal" ? "flex items-center gap-4" : "flex flex-col gap-1.5", p), children: [
    /* @__PURE__ */ l(y, { htmlFor: e, required: t, children: n }),
    /* @__PURE__ */ s("div", { className: c("flex flex-col gap-1", a === "horizontal" && "flex-1"), children: [
      /* @__PURE__ */ l(
        A,
        {
          ref: g,
          id: e,
          hasError: r,
          required: t,
          "aria-describedby": o ? `${e}-desc` : void 0,
          onChange: f,
          onBlur: d,
          onFocus: x,
          onKeyDown: h,
          onEnterPress: I,
          onClear: v,
          ...b
        }
      ),
      o && !r && /* @__PURE__ */ l(i, { id: `${e}-desc`, message: o, type: "description" }),
      r && /* @__PURE__ */ l(i, { message: m, type: "error" })
    ] })
  ] });
};
export {
  w as FormFieldMoleculeView
};
//# sourceMappingURL=FormFieldMoleculeView.js.map
