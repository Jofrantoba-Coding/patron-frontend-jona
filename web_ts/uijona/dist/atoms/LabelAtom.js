import { jsxs as l, jsx as m } from "react/jsx-runtime";
import d from "react";
import { cn as s } from "../lib/cn.js";
const i = d.forwardRef(
  ({ required: e, className: a, children: r, ...t }, o) => /* @__PURE__ */ l(
    "label",
    {
      ref: o,
      className: s("text-sm font-medium text-neutral-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", a),
      ...t,
      children: [
        r,
        e && /* @__PURE__ */ m("span", { className: "ml-0.5 text-danger-500", "aria-hidden": "true", children: "*" })
      ]
    }
  )
);
i.displayName = "LabelAtom";
export {
  i as LabelAtom
};
//# sourceMappingURL=LabelAtom.js.map
