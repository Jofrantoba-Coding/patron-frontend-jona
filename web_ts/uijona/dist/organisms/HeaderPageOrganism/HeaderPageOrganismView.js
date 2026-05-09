import { jsxs as s, jsx as e } from "react/jsx-runtime";
import { cn as i } from "../../lib/cn.js";
const x = ({
  title: m,
  nav: r,
  actions: t,
  className: a
}) => /* @__PURE__ */ s(
  "header",
  {
    className: i(
      "flex min-w-0 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6",
      "bg-white border-b border-neutral-200 shadow-sm",
      a
    ),
    children: [
      /* @__PURE__ */ e("div", { className: "min-w-0 flex-1 truncate text-lg font-semibold text-primary-600 md:flex-none", children: m }),
      r && /* @__PURE__ */ e("nav", { className: "hidden min-w-0 max-w-full items-center gap-4 overflow-x-auto text-sm text-neutral-600 md:flex", children: r }),
      t && /* @__PURE__ */ e("div", { className: "flex shrink-0 items-center gap-2", children: t })
    ]
  }
);
export {
  x as HeaderPageOrganismView
};
//# sourceMappingURL=HeaderPageOrganismView.js.map
