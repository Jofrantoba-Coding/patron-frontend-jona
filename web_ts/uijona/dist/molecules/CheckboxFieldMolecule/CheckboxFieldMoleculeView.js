import { jsxs as r, jsx as e } from "react/jsx-runtime";
import { cn as g } from "../../lib/cn.js";
import { PanelAtomImpl as a } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { CheckboxAtomImpl as f } from "../../atoms/CheckboxAtom/CheckboxAtomImpl.js";
import { LabelAtomImpl as h } from "../../atoms/LabelAtom/LabelAtomImpl.js";
import { ErrorMessageAtomImpl as l } from "../../atoms/ErrorMessageAtom/ErrorMessageAtomImpl.js";
const v = ({
  id: n,
  label: t,
  checked: i,
  onCheckedChange: p,
  description: m,
  errorMessage: s,
  disabled: c = !1,
  className: d
}) => {
  const o = !!s;
  return /* @__PURE__ */ r(a, { variant: "ghost", padding: "none", radius: "none", className: g("flex flex-col gap-1", d), children: [
    /* @__PURE__ */ r(a, { variant: "ghost", padding: "none", radius: "none", className: "flex items-start gap-2", children: [
      /* @__PURE__ */ e(f, { id: n, checked: i, onCheckedChange: p, disabled: c, hasError: o, "aria-label": t }),
      /* @__PURE__ */ r(a, { variant: "ghost", padding: "none", radius: "none", className: "flex flex-col gap-0.5", children: [
        /* @__PURE__ */ e(h, { htmlFor: n, className: "cursor-pointer leading-tight", children: t }),
        m && !o && /* @__PURE__ */ e(l, { message: m, type: "description" })
      ] })
    ] }),
    o && /* @__PURE__ */ e(l, { message: s, type: "error" })
  ] });
};
export {
  v as CheckboxFieldMoleculeView
};
//# sourceMappingURL=CheckboxFieldMoleculeView.js.map
