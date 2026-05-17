import { jsxs as t, jsx as e } from "react/jsx-runtime";
import { cn as m } from "../../lib/cn.js";
import { JPanelImpl as n } from "../../atoms/JPanel/JPanelImpl.js";
const x = ({
  text: i,
  left: o,
  center: a,
  right: r,
  className: s
}) => /* @__PURE__ */ t(
  "footer",
  {
    className: m(
      "flex min-w-0 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6",
      "bg-white border-t border-neutral-200 text-sm text-neutral-500",
      s
    ),
    children: [
      /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: "min-w-0 flex-1 break-words md:flex-none", children: o ?? /* @__PURE__ */ e("span", { children: i }) }),
      a && /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: "hidden min-w-0 max-w-full items-center gap-4 overflow-x-auto md:flex", children: a }),
      r && /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: "flex shrink-0 items-center gap-2", children: r })
    ]
  }
);
export {
  x as FooterPageOrganismView
};
//# sourceMappingURL=FooterPageOrganismView.js.map
