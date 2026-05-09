import { jsxs as c, jsx as e } from "react/jsx-runtime";
import { cn as s } from "../../lib/cn.js";
import { LabelAtomImpl as w } from "../../atoms/LabelAtom/LabelAtomImpl.js";
import { InputAtomImpl as y } from "../../atoms/InputAtom/InputAtomImpl.js";
import { ErrorMessageAtomImpl as i } from "../../atoms/ErrorMessageAtom/ErrorMessageAtomImpl.js";
const $ = ({
  id: l,
  label: n,
  errorMessage: a,
  description: m,
  orientation: o = "vertical",
  required: t,
  className: p,
  onChange: f,
  onBlur: x,
  onFocus: d,
  onKeyDown: h,
  onEnterPress: I,
  onClear: g,
  onValid: z,
  onInvalid: A,
  onInvalidInternal: F,
  forwardedRef: v,
  ...b
}) => {
  const r = !!a;
  return /* @__PURE__ */ c("div", { className: s(o === "horizontal" ? "flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4" : "flex flex-col gap-1.5", p), children: [
    /* @__PURE__ */ e(w, { htmlFor: l, required: t, className: s(o === "horizontal" && "sm:shrink-0"), children: n }),
    /* @__PURE__ */ c("div", { className: s("flex min-w-0 flex-col gap-1", o === "horizontal" && "sm:flex-1"), children: [
      /* @__PURE__ */ e(
        y,
        {
          ref: v,
          id: l,
          hasError: r,
          required: t,
          "aria-describedby": m ? `${l}-desc` : void 0,
          onChange: f,
          onBlur: x,
          onFocus: d,
          onKeyDown: h,
          onEnterPress: I,
          onClear: g,
          ...b
        }
      ),
      m && !r && /* @__PURE__ */ e(i, { id: `${l}-desc`, message: m, type: "description" }),
      r && /* @__PURE__ */ e(i, { message: a, type: "error" })
    ] })
  ] });
};
export {
  $ as FormFieldMoleculeView
};
//# sourceMappingURL=FormFieldMoleculeView.js.map
