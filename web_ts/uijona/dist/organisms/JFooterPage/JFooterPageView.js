import { jsxs as s, jsx as e } from "react/jsx-runtime";
import { cn as l } from "../../lib/cn.js";
import { JPanelImpl as n } from "../../atoms/JPanel/JPanelImpl.js";
const x = ({
  text: o,
  left: t,
  center: a,
  right: r,
  className: i
}) => /* @__PURE__ */ s(
  "footer",
  {
    className: l(
      "flex min-w-0 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6",
      "bg-white border-t border-neutral-200 text-sm text-neutral-500",
      i
    ),
    children: [
      /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: "min-w-0 flex-1 break-words md:flex-none", children: t ?? /* @__PURE__ */ e("span", { children: o }) }),
      a && /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: "hidden min-w-0 max-w-full items-center gap-4 overflow-x-auto md:flex", children: a }),
      r && /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: "flex shrink-0 items-center gap-2", children: r })
    ]
  }
);
export {
  x as JFooterPageView
};
//# sourceMappingURL=JFooterPageView.js.map
