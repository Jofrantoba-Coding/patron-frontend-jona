import { jsxs as v, jsx as o } from "react/jsx-runtime";
import { cn as g } from "../../lib/cn.js";
import { JPanelImpl as J } from "../../atoms/JPanel/JPanelImpl.js";
import { JComboBoxImpl as I } from "../../atoms/JComboBox/JComboBoxImpl.js";
import { JLabelImpl as m } from "../../atoms/JLabel/JLabelImpl.js";
const y = ({
  id: r,
  label: t,
  options: s,
  groups: i,
  placeholder: c,
  errorMessage: l,
  description: a,
  required: n,
  className: p,
  onChange: f,
  onBlur: d,
  onFocus: x,
  forwardedRef: b,
  ...h
}) => {
  const e = !!l;
  return /* @__PURE__ */ v(J, { variant: "ghost", padding: "none", radius: "none", className: g("flex flex-col gap-1.5", p), children: [
    /* @__PURE__ */ o(m, { variant: "label", htmlFor: r, required: n, children: t }),
    /* @__PURE__ */ o(
      I,
      {
        ref: b,
        id: r,
        options: s,
        groups: i,
        placeholder: c,
        hasError: e,
        required: n,
        "aria-describedby": a ? `${r}-desc` : void 0,
        onChange: f,
        onBlur: d,
        onFocus: x,
        ...h
      }
    ),
    a && !e && /* @__PURE__ */ o(m, { id: `${r}-desc`, message: a, variant: "description" }),
    e && /* @__PURE__ */ o(m, { message: l, variant: "error" })
  ] });
};
export {
  y as JSelectFieldView
};
//# sourceMappingURL=JSelectFieldView.js.map
