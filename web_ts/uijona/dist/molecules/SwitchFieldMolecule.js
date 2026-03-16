import { jsxs as p, jsx as r } from "react/jsx-runtime";
import { cn as i } from "../lib/cn.js";
import { SwitchAtom as y } from "../atoms/SwitchAtom.js";
import { LabelAtom as b } from "../atoms/LabelAtom.js";
import { ErrorMessageAtom as f } from "../atoms/ErrorMessageAtom.js";
const E = ({
  id: e,
  label: u,
  checked: s = !1,
  onCheckedChange: o,
  description: m,
  errorMessage: a,
  disabled: t = !1,
  size: x = "md",
  card: v = !1,
  className: n
}) => {
  const l = !!a, c = /* @__PURE__ */ p("div", { className: "flex items-center justify-between gap-4", children: [
    /* @__PURE__ */ p("div", { className: "flex flex-col gap-0.5 min-w-0", children: [
      /* @__PURE__ */ r(b, { htmlFor: e, className: i("cursor-pointer", t && "opacity-50"), children: u }),
      m && !l && /* @__PURE__ */ r(f, { message: m, type: "description" }),
      l && /* @__PURE__ */ r(f, { message: a, type: "error" })
    ] }),
    /* @__PURE__ */ r(y, { id: e, checked: s, onCheckedChange: o, disabled: t, hasError: l, size: x, "aria-labelledby": `${e}-label` })
  ] });
  return v ? /* @__PURE__ */ r("div", { className: i("rounded-md border border-neutral-200 p-4 cursor-pointer hover:bg-neutral-50 transition-colors duration-150", t && "pointer-events-none opacity-50", n), onClick: () => !t && (o == null ? void 0 : o(!s)), children: c }) : /* @__PURE__ */ r("div", { className: i("flex flex-col gap-1", n), children: c });
};
export {
  E as SwitchFieldMolecule
};
//# sourceMappingURL=SwitchFieldMolecule.js.map
