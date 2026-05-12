import { jsxs as A, jsx as o } from "react/jsx-runtime";
import { cn as I } from "../../lib/cn.js";
import { PanelAtomImpl as b } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { SelectAtomImpl as y } from "../../atoms/SelectAtom/SelectAtomImpl.js";
import { LabelAtomImpl as j } from "../../atoms/LabelAtom/LabelAtomImpl.js";
import { ErrorMessageAtomImpl as s } from "../../atoms/ErrorMessageAtom/ErrorMessageAtomImpl.js";
const w = ({
  id: e,
  label: a,
  options: p,
  groups: c,
  placeholder: n,
  errorMessage: t,
  description: r,
  required: l,
  className: i,
  onChange: f,
  onBlur: d,
  onFocus: g,
  forwardedRef: h,
  ...x
}) => {
  const m = !!t;
  return /* @__PURE__ */ A(b, { variant: "ghost", padding: "none", radius: "none", className: I("flex flex-col gap-1.5", i), children: [
    /* @__PURE__ */ o(j, { htmlFor: e, required: l, children: a }),
    /* @__PURE__ */ o(
      y,
      {
        ref: h,
        id: e,
        options: p,
        groups: c,
        placeholder: n,
        hasError: m,
        required: l,
        "aria-describedby": r ? `${e}-desc` : void 0,
        onChange: f,
        onBlur: d,
        onFocus: g,
        ...x
      }
    ),
    r && !m && /* @__PURE__ */ o(s, { id: `${e}-desc`, message: r, type: "description" }),
    m && /* @__PURE__ */ o(s, { message: t, type: "error" })
  ] });
};
export {
  w as SelectFieldMoleculeView
};
//# sourceMappingURL=SelectFieldMoleculeView.js.map
