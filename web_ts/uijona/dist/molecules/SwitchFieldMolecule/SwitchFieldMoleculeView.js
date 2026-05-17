import { jsxs as f, jsx as r } from "react/jsx-runtime";
import { cn as a } from "../../lib/cn.js";
import { JPanelImpl as t } from "../../atoms/JPanel/JPanelImpl.js";
import { SwitchAtomImpl as v } from "../../atoms/SwitchAtom/SwitchAtomImpl.js";
import { LabelAtomImpl as y } from "../../atoms/LabelAtom/LabelAtomImpl.js";
import { ErrorMessageAtomImpl as u } from "../../atoms/ErrorMessageAtom/ErrorMessageAtomImpl.js";
const A = ({
  id: e,
  label: d,
  checked: l,
  onCheckedChange: o,
  description: s,
  errorMessage: m,
  disabled: n = !1,
  size: g = "md",
  card: x = !1,
  className: p
}) => {
  const i = !!m, c = /* @__PURE__ */ f(t, { variant: "ghost", padding: "none", radius: "none", className: "flex items-center justify-between gap-4", children: [
    /* @__PURE__ */ f(t, { variant: "ghost", padding: "none", radius: "none", className: "flex flex-col gap-0.5 min-w-0", children: [
      /* @__PURE__ */ r(y, { htmlFor: e, className: a("cursor-pointer", n && "opacity-50"), children: d }),
      s && !i && /* @__PURE__ */ r(u, { message: s, type: "description" }),
      i && /* @__PURE__ */ r(u, { message: m, type: "error" })
    ] }),
    /* @__PURE__ */ r(v, { id: e, checked: l, onCheckedChange: o, disabled: n, hasError: i, size: g, "aria-labelledby": `${e}-label` })
  ] });
  return x ? /* @__PURE__ */ r(
    t,
    {
      variant: "ghost",
      padding: "none",
      radius: "none",
      className: a("rounded-md border border-neutral-200 p-4 cursor-pointer hover:bg-neutral-50 transition-colors duration-150", n && "pointer-events-none opacity-50", p),
      onClick: () => !n && (o == null ? void 0 : o(!l)),
      children: c
    }
  ) : /* @__PURE__ */ r(t, { variant: "ghost", padding: "none", radius: "none", className: a("flex flex-col gap-1", p), children: c });
};
export {
  A as SwitchFieldMoleculeView
};
//# sourceMappingURL=SwitchFieldMoleculeView.js.map
