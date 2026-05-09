import { jsxs as n, jsx as r } from "react/jsx-runtime";
import { cn as o } from "../../lib/cn.js";
const i = {
  default: "bg-neutral-50 border-neutral-200 text-neutral-900",
  destructive: "bg-red-50 border-danger-500 text-danger-600"
}, c = ({
  variant: l = "default",
  title: t,
  icon: e,
  className: d,
  children: a,
  ...s
}) => /* @__PURE__ */ n(
  "div",
  {
    role: "alert",
    className: o("relative w-full min-w-0 rounded-md border p-4", e && "pl-11", i[l], d),
    ...s,
    children: [
      e && /* @__PURE__ */ r("span", { className: "absolute left-4 top-4 text-current", children: e }),
      t && /* @__PURE__ */ r("h5", { className: "mb-1 break-words font-medium leading-tight tracking-tight", children: t }),
      a && /* @__PURE__ */ r("div", { className: "break-words text-sm [&_p]:leading-relaxed", children: a })
    ]
  }
);
export {
  c as AlertMoleculeView
};
//# sourceMappingURL=AlertMoleculeView.js.map
