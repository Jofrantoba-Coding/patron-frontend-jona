import { jsxs as t, jsx as o } from "react/jsx-runtime";
import { cn as a } from "../../lib/cn.js";
import { JPanelImpl as i } from "../../atoms/JPanel/JPanelImpl.js";
import { LabelAtomImpl as w } from "../../atoms/LabelAtom/LabelAtomImpl.js";
import { JTextBoxImpl as y } from "../../atoms/JTextBox/JTextBoxImpl.js";
import { ErrorMessageAtomImpl as p } from "../../atoms/ErrorMessageAtom/ErrorMessageAtomImpl.js";
const k = ({
  id: e,
  label: c,
  errorMessage: s,
  description: r,
  orientation: l = "vertical",
  required: n,
  className: f,
  onChange: d,
  onBlur: x,
  onFocus: h,
  onKeyDown: g,
  onEnterPress: I,
  onClear: v,
  onValid: z,
  onInvalid: F,
  onInvalidInternal: N,
  forwardedRef: b,
  ...u
}) => {
  const m = !!s;
  return /* @__PURE__ */ t(i, { variant: "ghost", padding: "none", radius: "none", className: a(l === "horizontal" ? "flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4" : "flex flex-col gap-1.5", f), children: [
    /* @__PURE__ */ o(w, { htmlFor: e, required: n, className: a(l === "horizontal" && "sm:shrink-0"), children: c }),
    /* @__PURE__ */ t(i, { variant: "ghost", padding: "none", radius: "none", className: a("flex min-w-0 flex-col gap-1", l === "horizontal" && "sm:flex-1"), children: [
      /* @__PURE__ */ o(
        y,
        {
          ref: b,
          id: e,
          hasError: m,
          required: n,
          "aria-describedby": r ? `${e}-desc` : void 0,
          onChange: d,
          onBlur: x,
          onFocus: h,
          onKeyDown: g,
          onEnterPress: I,
          onClear: v,
          ...u
        }
      ),
      r && !m && /* @__PURE__ */ o(p, { id: `${e}-desc`, message: r, type: "description" }),
      m && /* @__PURE__ */ o(p, { message: s, type: "error" })
    ] })
  ] });
};
export {
  k as FormFieldMoleculeView
};
//# sourceMappingURL=FormFieldMoleculeView.js.map
