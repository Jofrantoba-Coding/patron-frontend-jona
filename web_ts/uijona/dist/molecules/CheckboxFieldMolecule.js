import { jsxs as o, jsx as e } from "react/jsx-runtime";
import { cn as n } from "../lib/cn.js";
import { CheckboxAtom as x } from "../atoms/CheckboxAtom.js";
import { LabelAtom as h } from "../atoms/LabelAtom.js";
import { ErrorMessageAtom as t } from "../atoms/ErrorMessageAtom.js";
const v = ({
  id: l,
  label: s,
  checked: c = !1,
  onCheckedChange: i,
  description: a,
  errorMessage: m,
  disabled: f = !1,
  className: p
}) => {
  const r = !!m;
  return /* @__PURE__ */ o("div", { className: n("flex flex-col gap-1", p), children: [
    /* @__PURE__ */ o("div", { className: "flex items-start gap-2", children: [
      /* @__PURE__ */ e(x, { id: l, checked: c, onCheckedChange: i, disabled: f, hasError: r, "aria-label": s }),
      /* @__PURE__ */ o("div", { className: "flex flex-col gap-0.5", children: [
        /* @__PURE__ */ e(h, { htmlFor: l, className: "cursor-pointer leading-tight", children: s }),
        a && !r && /* @__PURE__ */ e(t, { message: a, type: "description" })
      ] })
    ] }),
    r && /* @__PURE__ */ e(t, { message: m, type: "error" })
  ] });
};
export {
  v as CheckboxFieldMolecule
};
//# sourceMappingURL=CheckboxFieldMolecule.js.map
