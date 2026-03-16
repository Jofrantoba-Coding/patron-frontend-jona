import { jsxs as i, jsx as e } from "react/jsx-runtime";
import { cn as m } from "../../lib/cn.js";
const n = ({
  title: s,
  nav: t,
  actions: r,
  className: a
}) => /* @__PURE__ */ i(
  "header",
  {
    className: m(
      "flex items-center justify-between px-6 py-3",
      "bg-white border-b border-neutral-200 shadow-sm",
      a
    ),
    children: [
      /* @__PURE__ */ e("div", { className: "flex items-center gap-3 font-semibold text-lg text-primary-600", children: s }),
      t && /* @__PURE__ */ e("nav", { className: "hidden md:flex items-center gap-4 text-sm text-neutral-600", children: t }),
      r && /* @__PURE__ */ e("div", { className: "flex items-center gap-2", children: r })
    ]
  }
);
export {
  n as HeaderPageOrganismView
};
//# sourceMappingURL=HeaderPageOrganismView.js.map
