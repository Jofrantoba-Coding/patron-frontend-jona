import { jsxs as t, jsx as e } from "react/jsx-runtime";
import { cn as a } from "../../lib/cn.js";
import { PanelAtomImpl as i } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { LabelAtomImpl as b } from "../../atoms/LabelAtom/LabelAtomImpl.js";
import { InputAtomImpl as w } from "../../atoms/InputAtom/InputAtomImpl.js";
import { ErrorMessageAtomImpl as p } from "../../atoms/ErrorMessageAtom/ErrorMessageAtomImpl.js";
const L = ({
  id: o,
  label: c,
  errorMessage: n,
  description: r,
  orientation: l = "vertical",
  required: s,
  className: f,
  onChange: d,
  onBlur: h,
  onFocus: x,
  onKeyDown: g,
  onEnterPress: I,
  onClear: v,
  onValid: y,
  onInvalid: z,
  onInvalidInternal: F,
  forwardedRef: u,
  ...A
}) => {
  const m = !!n;
  return /* @__PURE__ */ t(i, { variant: "ghost", padding: "none", radius: "none", className: a(l === "horizontal" ? "flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4" : "flex flex-col gap-1.5", f), children: [
    /* @__PURE__ */ e(b, { htmlFor: o, required: s, className: a(l === "horizontal" && "sm:shrink-0"), children: c }),
    /* @__PURE__ */ t(i, { variant: "ghost", padding: "none", radius: "none", className: a("flex min-w-0 flex-col gap-1", l === "horizontal" && "sm:flex-1"), children: [
      /* @__PURE__ */ e(
        w,
        {
          ref: u,
          id: o,
          hasError: m,
          required: s,
          "aria-describedby": r ? `${o}-desc` : void 0,
          onChange: d,
          onBlur: h,
          onFocus: x,
          onKeyDown: g,
          onEnterPress: I,
          onClear: v,
          ...A
        }
      ),
      r && !m && /* @__PURE__ */ e(p, { id: `${o}-desc`, message: r, type: "description" }),
      m && /* @__PURE__ */ e(p, { message: n, type: "error" })
    ] })
  ] });
};
export {
  L as FormFieldMoleculeView
};
//# sourceMappingURL=FormFieldMoleculeView.js.map
