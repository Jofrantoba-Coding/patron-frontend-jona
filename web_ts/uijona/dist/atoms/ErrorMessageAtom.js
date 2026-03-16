import { jsx as n } from "react/jsx-runtime";
import { cn as l } from "../lib/cn.js";
const a = ({ message: r, type: t = "error", className: e, ...o }) => r ? /* @__PURE__ */ n(
  "p",
  {
    role: t === "error" ? "alert" : void 0,
    className: l("text-xs mt-1", t === "error" ? "text-danger-500" : "text-neutral-500", e),
    ...o,
    children: r
  }
) : null;
export {
  a as ErrorMessageAtom
};
//# sourceMappingURL=ErrorMessageAtom.js.map
