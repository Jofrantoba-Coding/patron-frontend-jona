import { jsxs as t, jsx as l } from "react/jsx-runtime";
import { cn as s } from "../../lib/cn.js";
import { RadioAtomImpl as v } from "../../atoms/RadioAtom/RadioAtomImpl.js";
const b = ({
  name: c,
  options: x,
  selectedValue: o,
  label: r,
  errorMessage: a,
  description: d,
  orientation: u = "vertical",
  disabled: m,
  className: f,
  onOptionChange: h
}) => /* @__PURE__ */ t("fieldset", { className: s("flex flex-col gap-2", f), disabled: m, children: [
  r && /* @__PURE__ */ l("legend", { className: "text-sm font-medium text-neutral-900", children: r }),
  d && /* @__PURE__ */ l("p", { className: "text-sm text-neutral-500", children: d }),
  /* @__PURE__ */ l(
    "div",
    {
      role: "radiogroup",
      "aria-invalid": !!a || void 0,
      className: s(
        "flex gap-3",
        u === "vertical" ? "flex-col" : "flex-row flex-wrap"
      ),
      children: x.map((e) => {
        const i = `${c}-${e.value}`, n = m || e.disabled;
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
                v,
                {
                  id: i,
                  name: c,
                  value: e.value,
                  checked: o === e.value,
                  disabled: n,
                  hasError: !!a,
                  onCheckedChange: (p) => {
                    p && h(e);
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
  b as RadioGroupMoleculeView
};
//# sourceMappingURL=RadioGroupMoleculeView.js.map
