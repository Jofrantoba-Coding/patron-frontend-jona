import { jsx as o } from "react/jsx-runtime";
import { cn as r } from "../../lib/cn.js";
import { JPanelImpl as a } from "../JPanel/JPanelImpl.js";
const d = ({ circle: e = !1, className: n }) => /* @__PURE__ */ o(
  a,
  {
    variant: "ghost",
    padding: "none",
    radius: "none",
    "aria-hidden": "true",
    className: r(
      "animate-pulse bg-neutral-200",
      e ? "rounded-full" : "rounded",
      n
    )
  }
);
export {
  d as SkeletonAtomView
};
//# sourceMappingURL=SkeletonAtomView.js.map
