import { jsx as a } from "react/jsx-runtime";
import { cn as t } from "../lib/cn.js";
const p = ({ orientation: r = "horizontal", className: o }) => /* @__PURE__ */ a(
  "div",
  {
    role: "separator",
    "aria-orientation": r,
    className: t("bg-neutral-200 shrink-0", r === "horizontal" ? "h-px w-full" : "w-px h-full", o)
  }
);
export {
  p as SeparatorAtom
};
//# sourceMappingURL=SeparatorAtom.js.map
