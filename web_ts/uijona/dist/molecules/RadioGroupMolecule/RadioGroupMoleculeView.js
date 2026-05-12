import { jsxs as t, jsx as l } from "react/jsx-runtime";
import { cn as s } from "../../lib/cn.js";
import { PanelAtomImpl as v } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { RadioAtomImpl as N } from "../../atoms/RadioAtom/RadioAtomImpl.js";
const j = ({
  name: r,
  options: o,
  selectedValue: x,
  label: c,
  errorMessage: a,
  description: m,
  orientation: u = "vertical",
  disabled: d,
  className: f,
  onOptionChange: p
}) => /* @__PURE__ */ t("fieldset", { className: s("flex flex-col gap-2", f), disabled: d, children: [
  c && /* @__PURE__ */ l("legend", { className: "text-sm font-medium text-neutral-900", children: c }),
  m && /* @__PURE__ */ l("p", { className: "text-sm text-neutral-500", children: m }),
  /* @__PURE__ */ l(
    v,
    {
      variant: "ghost",
      padding: "none",
      radius: "none",
      role: "radiogroup",
      "aria-invalid": !!a || void 0,
      className: s(
        "flex gap-3",
        u === "vertical" ? "flex-col" : "flex-row flex-wrap"
      ),
      children: o.map((e) => {
        const i = `${r}-${e.value}`, n = d || e.disabled;
        return /* @__PURE__ */ t(
          "label",
          {
            htmlFor: i,
            className: s(
              "flex items-start gap-2 rounded-md",
              n ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            ),
            children: [
              /* @__PURE__ */ l(
                N,
                {
                  id: i,
                  name: r,
                  value: e.value,
                  checked: x === e.value,
                  disabled: n,
                  hasError: !!a,
                  onCheckedChange: (h) => {
                    h && p(e);
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
  j as RadioGroupMoleculeView
};
//# sourceMappingURL=RadioGroupMoleculeView.js.map
