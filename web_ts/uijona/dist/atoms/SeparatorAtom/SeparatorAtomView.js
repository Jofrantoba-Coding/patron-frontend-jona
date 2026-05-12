import { jsx as a } from "react/jsx-runtime";
import { cn as t } from "../../lib/cn.js";
import { PanelAtomImpl as n } from "../PanelAtom/PanelAtomImpl.js";
const m = ({
  orientation: o = "horizontal",
  className: r
}) => /* @__PURE__ */ a(
  n,
  {
    variant: "ghost",
    padding: "none",
    radius: "none",
    role: "separator",
    "aria-orientation": o,
    className: t(
      "bg-neutral-200 shrink-0",
      o === "horizontal" ? "h-px w-full" : "w-px h-full",
      r
    )
  }
);
export {
  m as SeparatorAtomView
};
//# sourceMappingURL=SeparatorAtomView.js.map
