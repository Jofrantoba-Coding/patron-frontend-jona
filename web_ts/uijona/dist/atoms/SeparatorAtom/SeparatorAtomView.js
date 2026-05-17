import { jsx as a } from "react/jsx-runtime";
import { cn as n } from "../../lib/cn.js";
import { JPanelImpl as t } from "../JPanel/JPanelImpl.js";
const p = ({
  orientation: o = "horizontal",
  className: r
}) => /* @__PURE__ */ a(
  t,
  {
    variant: "ghost",
    padding: "none",
    radius: "none",
    role: "separator",
    "aria-orientation": o,
    className: n(
      "bg-neutral-200 shrink-0",
      o === "horizontal" ? "h-px w-full" : "w-px h-full",
      r
    )
  }
);
export {
  p as SeparatorAtomView
};
//# sourceMappingURL=SeparatorAtomView.js.map
