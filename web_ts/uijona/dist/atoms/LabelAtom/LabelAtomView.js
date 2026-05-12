import { jsxs as r, jsx as s } from "react/jsx-runtime";
import { cn as m } from "../../lib/cn.js";
const d = ({
  htmlFor: e,
  required: a = !1,
  disabled: t = !1,
  className: l,
  children: n,
  ...o
}) => /* @__PURE__ */ r(
  "label",
  {
    ...o,
    htmlFor: e,
    className: m(
      "text-sm font-medium text-neutral-700 leading-none",
      t && "opacity-50 cursor-not-allowed",
      l
    ),
    children: [
      n,
      a && /* @__PURE__ */ s("span", { className: "ml-0.5 text-danger-500", "aria-hidden": "true", children: "*" })
    ]
  }
);
export {
  d as LabelAtomView
};
//# sourceMappingURL=LabelAtomView.js.map
