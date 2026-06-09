import { jsx as e } from "react/jsx-runtime";
import { cn as i } from "../../lib/cn.js";
import { JSEPARATOR_DEFAULTS as p } from "./InterJSeparator.js";
const l = ({
  orientation: r = p.orientation,
  className: a,
  style: o,
  forwardedRef: t
}) => /* @__PURE__ */ e(
  "div",
  {
    ref: t,
    role: "separator",
    "aria-orientation": r,
    "data-jseparator-orientation": r,
    style: o,
    className: i(
      "jseparator",
      "bg-neutral-200 shrink-0",
      r === "horizontal" ? "h-px w-full" : "w-px h-full",
      a
    )
  }
);
l.displayName = "JSeparatorView";
export {
  l as JSeparatorView
};
//# sourceMappingURL=JSeparatorView.js.map
