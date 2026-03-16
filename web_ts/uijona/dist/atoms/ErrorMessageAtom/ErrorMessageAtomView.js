import { jsx as n } from "react/jsx-runtime";
import { cn as l } from "../../lib/cn.js";
const a = ({
  message: r,
  type: e = "error",
  id: t,
  className: o
}) => r ? /* @__PURE__ */ n(
  "p",
  {
    id: t,
    role: e === "error" ? "alert" : void 0,
    className: l(
      "text-xs",
      e === "error" ? "text-danger-500" : "text-neutral-500",
      o
    ),
    children: r
  }
) : null;
export {
  a as ErrorMessageAtomView
};
//# sourceMappingURL=ErrorMessageAtomView.js.map
