import { jsxs as c, jsx as r } from "react/jsx-runtime";
import { cn as i } from "../../lib/cn.js";
import { SwitchAtomImpl as y } from "../../atoms/SwitchAtom/SwitchAtomImpl.js";
import { LabelAtomImpl as b } from "../../atoms/LabelAtom/LabelAtomImpl.js";
import { ErrorMessageAtomImpl as f } from "../../atoms/ErrorMessageAtom/ErrorMessageAtomImpl.js";
const I = ({
  id: e,
  label: u,
  checked: m = !1,
  onCheckedChange: o,
  description: s,
  errorMessage: a,
  disabled: t = !1,
  size: x = "md",
  card: v = !1,
  className: p
}) => {
  const l = !!a, n = /* @__PURE__ */ c("div", { className: "flex items-center justify-between gap-4", children: [
    /* @__PURE__ */ c("div", { className: "flex flex-col gap-0.5 min-w-0", children: [
      /* @__PURE__ */ r(b, { htmlFor: e, className: i("cursor-pointer", t && "opacity-50"), children: u }),
      s && !l && /* @__PURE__ */ r(f, { message: s, type: "description" }),
      l && /* @__PURE__ */ r(f, { message: a, type: "error" })
    ] }),
    /* @__PURE__ */ r(y, { id: e, checked: m, onCheckedChange: o, disabled: t, hasError: l, size: x, "aria-labelledby": `${e}-label` })
  ] });
  return v ? /* @__PURE__ */ r(
    "div",
    {
      className: i("rounded-md border border-neutral-200 p-4 cursor-pointer hover:bg-neutral-50 transition-colors duration-150", t && "pointer-events-none opacity-50", p),
      onClick: () => !t && (o == null ? void 0 : o(!m)),
      children: n
    }
  ) : /* @__PURE__ */ r("div", { className: i("flex flex-col gap-1", p), children: n });
};
export {
  I as SwitchFieldMoleculeView
};
//# sourceMappingURL=SwitchFieldMoleculeView.js.map
