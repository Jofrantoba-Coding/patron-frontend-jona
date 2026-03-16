import { jsxs as o, jsx as r } from "react/jsx-runtime";
import { cn as s } from "../../lib/cn.js";
const c = ({
  htmlFor: e,
  required: a = !1,
  disabled: t = !1,
  className: l,
  children: n
}) => /* @__PURE__ */ o(
  "label",
  {
    htmlFor: e,
    className: s(
      "text-sm font-medium text-neutral-700 leading-none",
      t && "opacity-50 cursor-not-allowed",
      l
    ),
    children: [
      n,
      a && /* @__PURE__ */ r("span", { className: "ml-0.5 text-danger-500", "aria-hidden": "true", children: "*" })
    ]
  }
);
export {
  c as LabelAtomView
};
//# sourceMappingURL=LabelAtomView.js.map
