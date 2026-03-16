import { jsxs as g, jsx as r } from "react/jsx-runtime";
import { cn as y } from "../../lib/cn.js";
import { SelectAtomImpl as A } from "../../atoms/SelectAtom/SelectAtomImpl.js";
import { LabelAtomImpl as I } from "../../atoms/LabelAtom/LabelAtomImpl.js";
import { ErrorMessageAtomImpl as s } from "../../atoms/ErrorMessageAtom/ErrorMessageAtomImpl.js";
const $ = ({
  id: e,
  label: c,
  options: p,
  groups: a,
  placeholder: f,
  errorMessage: l,
  description: o,
  required: t,
  className: i,
  onChange: d,
  onBlur: n,
  onFocus: x,
  forwardedRef: h,
  ...b
}) => {
  const m = !!l;
  return /* @__PURE__ */ g("div", { className: y("flex flex-col gap-1.5", i), children: [
    /* @__PURE__ */ r(I, { htmlFor: e, required: t, children: c }),
    /* @__PURE__ */ r(
      A,
      {
        ref: h,
        id: e,
        options: p,
        groups: a,
        placeholder: f,
        hasError: m,
        required: t,
        "aria-describedby": o ? `${e}-desc` : void 0,
        onChange: d,
        onBlur: n,
        onFocus: x,
        ...b
      }
    ),
    o && !m && /* @__PURE__ */ r(s, { id: `${e}-desc`, message: o, type: "description" }),
    m && /* @__PURE__ */ r(s, { message: l, type: "error" })
  ] });
};
export {
  $ as SelectFieldMoleculeView
};
//# sourceMappingURL=SelectFieldMoleculeView.js.map
