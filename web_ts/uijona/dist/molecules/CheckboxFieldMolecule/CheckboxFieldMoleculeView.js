import { jsxs as r, jsx as e } from "react/jsx-runtime";
import { cn as g } from "../../lib/cn.js";
import { JPanelImpl as a } from "../../atoms/JPanel/JPanelImpl.js";
import { CheckboxAtomImpl as f } from "../../atoms/CheckboxAtom/CheckboxAtomImpl.js";
import { LabelAtomImpl as h } from "../../atoms/LabelAtom/LabelAtomImpl.js";
import { ErrorMessageAtomImpl as m } from "../../atoms/ErrorMessageAtom/ErrorMessageAtomImpl.js";
const A = ({
  id: n,
  label: s,
  checked: i,
  onCheckedChange: p,
  description: t,
  errorMessage: l,
  disabled: c = !1,
  className: d
}) => {
  const o = !!l;
  return /* @__PURE__ */ r(a, { variant: "ghost", padding: "none", radius: "none", className: g("flex flex-col gap-1", d), children: [
    /* @__PURE__ */ r(a, { variant: "ghost", padding: "none", radius: "none", className: "flex items-start gap-2", children: [
      /* @__PURE__ */ e(f, { id: n, checked: i, onCheckedChange: p, disabled: c, hasError: o, "aria-label": s }),
      /* @__PURE__ */ r(a, { variant: "ghost", padding: "none", radius: "none", className: "flex flex-col gap-0.5", children: [
        /* @__PURE__ */ e(h, { htmlFor: n, className: "cursor-pointer leading-tight", children: s }),
        t && !o && /* @__PURE__ */ e(m, { message: t, type: "description" })
      ] })
    ] }),
    o && /* @__PURE__ */ e(m, { message: l, type: "error" })
  ] });
};
export {
  A as CheckboxFieldMoleculeView
};
//# sourceMappingURL=CheckboxFieldMoleculeView.js.map
