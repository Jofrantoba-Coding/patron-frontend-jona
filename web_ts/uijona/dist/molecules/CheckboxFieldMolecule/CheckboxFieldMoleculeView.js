import { jsxs as l, jsx as e } from "react/jsx-runtime";
import { cn as n } from "../../lib/cn.js";
import { CheckboxAtomImpl as x } from "../../atoms/CheckboxAtom/CheckboxAtomImpl.js";
import { LabelAtomImpl as h } from "../../atoms/LabelAtom/LabelAtomImpl.js";
import { ErrorMessageAtomImpl as t } from "../../atoms/ErrorMessageAtom/ErrorMessageAtomImpl.js";
const v = ({
  id: o,
  label: m,
  checked: i = !1,
  onCheckedChange: c,
  description: s,
  errorMessage: a,
  disabled: p = !1,
  className: f
}) => {
  const r = !!a;
  return /* @__PURE__ */ l("div", { className: n("flex flex-col gap-1", f), children: [
    /* @__PURE__ */ l("div", { className: "flex items-start gap-2", children: [
      /* @__PURE__ */ e(x, { id: o, checked: i, onCheckedChange: c, disabled: p, hasError: r, "aria-label": m }),
      /* @__PURE__ */ l("div", { className: "flex flex-col gap-0.5", children: [
        /* @__PURE__ */ e(h, { htmlFor: o, className: "cursor-pointer leading-tight", children: m }),
        s && !r && /* @__PURE__ */ e(t, { message: s, type: "description" })
      ] })
    ] }),
    r && /* @__PURE__ */ e(t, { message: a, type: "error" })
  ] });
};
export {
  v as CheckboxFieldMoleculeView
};
//# sourceMappingURL=CheckboxFieldMoleculeView.js.map
