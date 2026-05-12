import { jsxs as i, jsx as e } from "react/jsx-runtime";
import { cn as s } from "../../lib/cn.js";
import { PanelAtomImpl as t } from "../../atoms/PanelAtom/PanelAtomImpl.js";
const x = ({
  title: a,
  nav: n,
  actions: r,
  className: m
}) => /* @__PURE__ */ i(
  "header",
  {
    className: s(
      "flex min-w-0 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6",
      "bg-white border-b border-neutral-200 shadow-sm",
      m
    ),
    children: [
      /* @__PURE__ */ e(t, { variant: "ghost", padding: "none", radius: "none", className: "min-w-0 flex-1 truncate text-lg font-semibold text-primary-600 md:flex-none", children: a }),
      n && /* @__PURE__ */ e("nav", { className: "hidden min-w-0 max-w-full items-center gap-4 overflow-x-auto text-sm text-neutral-600 md:flex", children: n }),
      r && /* @__PURE__ */ e(t, { variant: "ghost", padding: "none", radius: "none", className: "flex shrink-0 items-center gap-2", children: r })
    ]
  }
);
export {
  x as HeaderPageOrganismView
};
//# sourceMappingURL=HeaderPageOrganismView.js.map
