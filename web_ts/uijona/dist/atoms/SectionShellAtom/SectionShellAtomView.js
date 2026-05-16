import { jsx as a } from "react/jsx-runtime";
import { cn as c } from "../../lib/cn.js";
const o = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl"
}, t = ({
  as: m = "div",
  maxWidth: s = "xl",
  className: x,
  children: e,
  ...l
}) => /* @__PURE__ */ a(
  m,
  {
    className: c("mx-auto w-full px-4 sm:px-6 lg:px-8", o[s], x),
    ...l,
    children: e
  }
);
export {
  t as SectionShellAtomView
};
//# sourceMappingURL=SectionShellAtomView.js.map
