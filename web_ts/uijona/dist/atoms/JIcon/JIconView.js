import { jsx as s } from "react/jsx-runtime";
import { JICON_DEFAULTS as i } from "./InterJIcon.js";
import { JButtonImpl as d } from "../JButton/JButtonImpl.js";
const f = ({
  icon: r,
  label: e,
  variant: t = i.variant,
  loading: o = i.loading,
  disabled: a = i.disabled,
  type: m = i.type,
  className: n,
  style: p,
  forwardedRef: l,
  ...c
}) => /* @__PURE__ */ s(
  d,
  {
    ref: l,
    type: m,
    size: "icon",
    variant: t,
    loading: o,
    disabled: a,
    "aria-label": e,
    className: n,
    style: p,
    ...c,
    children: !o && r
  }
);
f.displayName = "JIconView";
export {
  f as JIconView
};
//# sourceMappingURL=JIconView.js.map
