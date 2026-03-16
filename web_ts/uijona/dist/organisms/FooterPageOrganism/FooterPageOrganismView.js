import { jsxs as n, jsx as e } from "react/jsx-runtime";
import { cn as l } from "../../lib/cn.js";
const d = ({
  text: s,
  left: i,
  center: t,
  right: r,
  className: a
}) => /* @__PURE__ */ n(
  "footer",
  {
    className: l(
      "flex items-center justify-between px-6 py-3",
      "bg-white border-t border-neutral-200 text-sm text-neutral-500",
      a
    ),
    children: [
      /* @__PURE__ */ e("div", { className: "flex items-center gap-2", children: i ?? /* @__PURE__ */ e("span", { children: s }) }),
      t && /* @__PURE__ */ e("div", { className: "hidden md:flex items-center gap-4", children: t }),
      r && /* @__PURE__ */ e("div", { className: "flex items-center gap-2", children: r })
    ]
  }
);
export {
  d as FooterPageOrganismView
};
//# sourceMappingURL=FooterPageOrganismView.js.map
