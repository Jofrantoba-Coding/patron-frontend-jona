import { jsxs as f, jsx as r } from "react/jsx-runtime";
import { cn as e } from "../../lib/cn.js";
import { JSwitchImpl as b } from "../../atoms/JSwitch/JSwitchImpl.js";
import { JLabelImpl as a } from "../../atoms/JLabel/JLabelImpl.js";
const j = ({
  id: i,
  label: u,
  checked: s,
  onCheckedChange: l,
  description: n,
  errorMessage: m,
  disabled: t = !1,
  size: v = "md",
  card: x = !1,
  className: c
}) => {
  const o = !!m, p = /* @__PURE__ */ f("div", { className: "flex items-center justify-between gap-4", children: [
    /* @__PURE__ */ f("div", { className: "flex min-w-0 flex-col gap-0.5", children: [
      /* @__PURE__ */ r(
        a,
        {
          variant: "label",
          htmlFor: i,
          className: e("cursor-pointer", t && "opacity-50"),
          children: u
        }
      ),
      n && !o && /* @__PURE__ */ r(a, { message: n, variant: "description" }),
      o && /* @__PURE__ */ r(a, { message: m, variant: "error" })
    ] }),
    /* @__PURE__ */ r(
      b,
      {
        id: i,
        checked: s,
        onCheckedChange: l,
        disabled: t,
        hasError: o,
        size: v,
        "aria-labelledby": `${i}-label`
      }
    )
  ] });
  return x ? /* @__PURE__ */ r(
    "div",
    {
      className: e(
        "cursor-pointer rounded-md border border-neutral-200 p-4 transition-colors duration-150 hover:bg-neutral-50",
        t && "pointer-events-none opacity-50",
        c
      ),
      onClick: () => !t && (l == null ? void 0 : l(!s)),
      children: p
    }
  ) : /* @__PURE__ */ r("div", { className: e("flex flex-col gap-1", c), children: p });
};
export {
  j as JSwitchFieldView
};
//# sourceMappingURL=JSwitchFieldView.js.map
