import { jsxs as e, jsx as a } from "react/jsx-runtime";
import { cn as g } from "../../lib/cn.js";
import { JPanelImpl as n } from "../../atoms/JPanel/JPanelImpl.js";
import { JCheckBoxImpl as h } from "../../atoms/JCheckBox/JCheckBoxImpl.js";
import { JLabelImpl as o } from "../../atoms/JLabel/JLabelImpl.js";
const N = ({
  id: i,
  label: l,
  checked: m,
  onCheckedChange: c,
  description: s,
  errorMessage: t,
  disabled: p = !1,
  className: d
}) => {
  const r = !!t;
  return /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: g("flex flex-col gap-1", d), children: [
    /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: "flex items-start gap-2", children: [
      /* @__PURE__ */ a(h, { id: i, checked: m, onCheckedChange: c, disabled: p, hasError: r, "aria-label": l }),
      /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: "flex flex-col gap-0.5", children: [
        /* @__PURE__ */ a(o, { variant: "label", htmlFor: i, className: "cursor-pointer leading-tight", children: l }),
        s && !r && /* @__PURE__ */ a(o, { message: s, variant: "description" })
      ] })
    ] }),
    r && /* @__PURE__ */ a(o, { message: t, variant: "error" })
  ] });
};
export {
  N as JCheckBoxFieldView
};
//# sourceMappingURL=JCheckBoxFieldView.js.map
