import { jsxs as o, jsx as e } from "react/jsx-runtime";
import { cn as n } from "../../lib/cn.js";
import { CheckboxAtomImpl as x } from "../../atoms/CheckboxAtom/CheckboxAtomImpl.js";
import { LabelAtomImpl as h } from "../../atoms/LabelAtom/LabelAtomImpl.js";
import { ErrorMessageAtomImpl as a } from "../../atoms/ErrorMessageAtom/ErrorMessageAtomImpl.js";
const v = ({
  id: l,
  label: m,
  checked: i,
  onCheckedChange: c,
  description: s,
  errorMessage: t,
  disabled: p = !1,
  className: f
}) => {
  const r = !!t;
  return /* @__PURE__ */ o("div", { className: n("flex flex-col gap-1", f), children: [
    /* @__PURE__ */ o("div", { className: "flex items-start gap-2", children: [
      /* @__PURE__ */ e(x, { id: l, checked: i, onCheckedChange: c, disabled: p, hasError: r, "aria-label": m }),
      /* @__PURE__ */ o("div", { className: "flex flex-col gap-0.5", children: [
        /* @__PURE__ */ e(h, { htmlFor: l, className: "cursor-pointer leading-tight", children: m }),
        s && !r && /* @__PURE__ */ e(a, { message: s, type: "description" })
      ] })
    ] }),
    r && /* @__PURE__ */ e(a, { message: t, type: "error" })
  ] });
};
export {
  v as CheckboxFieldMoleculeView
};
//# sourceMappingURL=CheckboxFieldMoleculeView.js.map
