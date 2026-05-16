import { jsx as a } from "react/jsx-runtime";
import { cn as i } from "../../lib/cn.js";
const o = {
  primary: "text-primary-600",
  white: "text-white/70",
  muted: "text-neutral-500"
}, n = ({
  variant: t = "primary",
  className: e,
  children: r,
  ...s
}) => /* @__PURE__ */ a(
  "span",
  {
    className: i(
      "block text-xs font-semibold uppercase tracking-widest",
      o[t],
      e
    ),
    ...s,
    children: r
  }
);
export {
  n as EyebrowAtomView
};
//# sourceMappingURL=EyebrowAtomView.js.map
