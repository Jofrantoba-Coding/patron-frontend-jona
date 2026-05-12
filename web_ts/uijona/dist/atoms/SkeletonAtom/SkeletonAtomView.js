import { jsx as n } from "react/jsx-runtime";
import { cn as r } from "../../lib/cn.js";
import { PanelAtomImpl as a } from "../PanelAtom/PanelAtomImpl.js";
const d = ({ circle: e = !1, className: o }) => /* @__PURE__ */ n(
  a,
  {
    variant: "ghost",
    padding: "none",
    radius: "none",
    "aria-hidden": "true",
    className: r(
      "animate-pulse bg-neutral-200",
      e ? "rounded-full" : "rounded",
      o
    )
  }
);
export {
  d as SkeletonAtomView
};
//# sourceMappingURL=SkeletonAtomView.js.map
