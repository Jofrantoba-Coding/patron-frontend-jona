import { jsxs as t, jsx as l } from "react/jsx-runtime";
import { cn as r } from "../../lib/cn.js";
import { JPanelImpl as v } from "../../atoms/JPanel/JPanelImpl.js";
import { RadioAtomImpl as N } from "../../atoms/RadioAtom/RadioAtomImpl.js";
import { LabelAtomImpl as g } from "../../atoms/LabelAtom/LabelAtomImpl.js";
const A = ({
  name: s,
  options: o,
  selectedValue: x,
  label: m,
  errorMessage: a,
  description: c,
  orientation: p = "vertical",
  disabled: d,
  className: u,
  onOptionChange: f
}) => /* @__PURE__ */ t("fieldset", { className: r("flex flex-col gap-2", u), disabled: d, children: [
  m && /* @__PURE__ */ l("legend", { className: "text-sm font-medium text-neutral-900", children: m }),
  c && /* @__PURE__ */ l("p", { className: "text-sm text-neutral-500", children: c }),
  /* @__PURE__ */ l(
    v,
    {
      variant: "ghost",
      padding: "none",
      radius: "none",
      role: "radiogroup",
      "aria-invalid": !!a || void 0,
      className: r(
        "flex gap-3",
        p === "vertical" ? "flex-col" : "flex-row flex-wrap"
      ),
      children: o.map((e) => {
        const i = `${s}-${e.value}`, n = d || e.disabled;
        return /* @__PURE__ */ t(
          g,
          {
            htmlFor: i,
            className: r(
              "flex items-start gap-2 rounded-md",
              n ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            ),
            children: [
              /* @__PURE__ */ l(
                N,
                {
                  id: i,
                  name: s,
                  value: e.value,
                  checked: x === e.value,
                  disabled: n,
                  hasError: !!a,
                  onCheckedChange: (h) => {
                    h && f(e);
                  },
                  className: "mt-0.5"
                }
              ),
              /* @__PURE__ */ t("span", { className: "flex flex-col gap-0.5", children: [
                /* @__PURE__ */ l("span", { className: "text-sm font-medium text-neutral-900", children: e.label }),
                e.description && /* @__PURE__ */ l("span", { className: "text-sm text-neutral-500", children: e.description })
              ] })
            ]
          },
          e.value
        );
      })
    }
  ),
  a && /* @__PURE__ */ l("p", { className: "text-sm text-danger-500", children: a })
] });
export {
  A as RadioGroupMoleculeView
};
//# sourceMappingURL=RadioGroupMoleculeView.js.map
