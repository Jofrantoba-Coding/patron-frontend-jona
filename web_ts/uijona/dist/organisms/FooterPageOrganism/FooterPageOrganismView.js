import { jsxs as a, jsx as e } from "react/jsx-runtime";
import { cn as l } from "../../lib/cn.js";
const d = ({
  text: i,
  left: n,
  center: r,
  right: s,
  className: t
}) => /* @__PURE__ */ a(
  "footer",
  {
    className: l(
      "flex min-w-0 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6",
      "bg-white border-t border-neutral-200 text-sm text-neutral-500",
      t
    ),
    children: [
      /* @__PURE__ */ e("div", { className: "min-w-0 flex-1 break-words md:flex-none", children: n ?? /* @__PURE__ */ e("span", { children: i }) }),
      r && /* @__PURE__ */ e("div", { className: "hidden min-w-0 max-w-full items-center gap-4 overflow-x-auto md:flex", children: r }),
      s && /* @__PURE__ */ e("div", { className: "flex shrink-0 items-center gap-2", children: s })
    ]
  }
);
export {
  d as FooterPageOrganismView
};
//# sourceMappingURL=FooterPageOrganismView.js.map
