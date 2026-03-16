import { jsx as a } from "react/jsx-runtime";
import { cn as t } from "../../lib/cn.js";
const e = ({
  orientation: r = "horizontal",
  className: o
}) => /* @__PURE__ */ a(
  "div",
  {
    role: "separator",
    "aria-orientation": r,
    className: t(
      "bg-neutral-200 shrink-0",
      r === "horizontal" ? "h-px w-full" : "w-px h-full",
      o
    )
  }
);
export {
  e as SeparatorAtomView
};
//# sourceMappingURL=SeparatorAtomView.js.map
