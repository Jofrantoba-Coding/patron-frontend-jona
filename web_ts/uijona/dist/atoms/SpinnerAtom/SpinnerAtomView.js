import { jsx as o } from "react/jsx-runtime";
import { cn as n } from "../../lib/cn.js";
const s = {
  sm: "w-3.5 h-3.5 border-2",
  md: "w-5 h-5 border-2",
  lg: "w-7 h-7 border-[3px]"
}, i = ({ size: r = "md", className: e }) => /* @__PURE__ */ o(
  "span",
  {
    role: "status",
    "aria-label": "Loading",
    className: n(
      "inline-block rounded-full border-current border-t-transparent animate-spin",
      s[r],
      e
    )
  }
);
export {
  i as SpinnerAtomView
};
//# sourceMappingURL=SpinnerAtomView.js.map
