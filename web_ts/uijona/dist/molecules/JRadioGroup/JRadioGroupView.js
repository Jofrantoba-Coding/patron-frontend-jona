import { jsxs as t, jsx as a } from "react/jsx-runtime";
import { cn as r } from "../../lib/cn.js";
import { JPanelImpl as v } from "../../atoms/JPanel/JPanelImpl.js";
import { JRadioButtonImpl as N } from "../../atoms/JRadioButton/JRadioButtonImpl.js";
import { JLabelImpl as g } from "../../atoms/JLabel/JLabelImpl.js";
const k = ({
  name: s,
  options: o,
  selectedValue: x,
  label: m,
  errorMessage: l,
  description: c,
  orientation: p = "vertical",
  disabled: d,
  className: u,
  onOptionChange: f
}) => /* @__PURE__ */ t("fieldset", { className: r("flex flex-col gap-2", u), disabled: d, children: [
  m && /* @__PURE__ */ a("legend", { className: "text-sm font-medium text-neutral-900", children: m }),
  c && /* @__PURE__ */ a("p", { className: "text-sm text-neutral-500", children: c }),
  /* @__PURE__ */ a(
    v,
    {
      variant: "ghost",
      padding: "none",
      radius: "none",
      role: "radiogroup",
      "aria-invalid": !!l || void 0,
      className: r(
        "flex gap-3",
        p === "vertical" ? "flex-col" : "flex-row flex-wrap"
      ),
      children: o.map((e) => {
        const i = `${s}-${e.value}`, n = d || e.disabled;
        return /* @__PURE__ */ t(
          g,
          {
            variant: "label",
            htmlFor: i,
            className: r(
              "flex items-start gap-2 rounded-md",
              n ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            ),
            children: [
              /* @__PURE__ */ a(
                N,
                {
                  id: i,
                  name: s,
                  value: e.value,
                  checked: x === e.value,
                  disabled: n,
                  hasError: !!l,
                  onCheckedChange: (h) => {
                    h && f(e);
                  },
                  className: "mt-0.5"
                }
              ),
              /* @__PURE__ */ t("span", { className: "flex flex-col gap-0.5", children: [
                /* @__PURE__ */ a("span", { className: "text-sm font-medium text-neutral-900", children: e.label }),
                e.description && /* @__PURE__ */ a("span", { className: "text-sm text-neutral-500", children: e.description })
              ] })
            ]
          },
          e.value
        );
      })
    }
  ),
  l && /* @__PURE__ */ a("p", { className: "text-sm text-danger-500", children: l })
] });
export {
  k as JRadioGroupView
};
//# sourceMappingURL=JRadioGroupView.js.map
