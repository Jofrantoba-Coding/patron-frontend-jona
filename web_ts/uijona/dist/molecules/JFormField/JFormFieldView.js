import { jsxs as n, jsx as l } from "react/jsx-runtime";
import { cn as s } from "../../lib/cn.js";
import { JTextBoxImpl as w } from "../../atoms/JTextBox/JTextBoxImpl.js";
import { JLabelImpl as m } from "../../atoms/JLabel/JLabelImpl.js";
const y = ({
  id: r,
  label: t,
  errorMessage: i,
  description: o,
  orientation: a = "vertical",
  required: c,
  className: f,
  onChange: x,
  onBlur: d,
  onFocus: h,
  onKeyDown: p,
  onEnterPress: v,
  onClear: b,
  onValid: z,
  onInvalid: B,
  forwardedRef: g,
  ...$
}) => {
  const e = !!i, j = [
    o && !e && `${r}-desc`,
    e && `${r}-error`
  ].filter(Boolean).join(" ") || void 0;
  return (
    // div nativo: evita --jpanel-direction:column que bloquea sm:flex-row en JPanel
    /* @__PURE__ */ n(
      "div",
      {
        className: s(
          "flex flex-col gap-1.5",
          a === "horizontal" && "sm:flex-row sm:items-center sm:gap-4",
          f
        ),
        children: [
          /* @__PURE__ */ l(
            m,
            {
              variant: "label",
              htmlFor: r,
              required: c,
              className: s(a === "horizontal" && "sm:shrink-0"),
              children: t
            }
          ),
          /* @__PURE__ */ n("div", { className: s("flex min-w-0 flex-col gap-1", a === "horizontal" && "sm:flex-1"), children: [
            /* @__PURE__ */ l(
              w,
              {
                ref: g,
                id: r,
                hasError: e,
                required: c,
                "aria-describedby": j,
                onChange: x,
                onBlur: d,
                onFocus: h,
                onKeyDown: p,
                onEnterPress: v,
                onClear: b,
                ...$
              }
            ),
            o && !e && /* @__PURE__ */ l(m, { id: `${r}-desc`, message: o, variant: "description" }),
            e && /* @__PURE__ */ l(m, { id: `${r}-error`, message: i, variant: "error" })
          ] })
        ]
      }
    )
  );
};
export {
  y as JFormFieldView
};
//# sourceMappingURL=JFormFieldView.js.map
