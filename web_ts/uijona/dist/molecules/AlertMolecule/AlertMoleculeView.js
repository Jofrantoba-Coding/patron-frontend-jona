import { jsxs as o, jsx as r } from "react/jsx-runtime";
import { cn as i } from "../../lib/cn.js";
import { JPanelImpl as n } from "../../atoms/JPanel/JPanelImpl.js";
const m = {
  default: "bg-neutral-50 border-neutral-200 text-neutral-900",
  destructive: "bg-red-50 border-danger-500 text-danger-600"
}, c = ({
  variant: l = "default",
  title: a,
  icon: e,
  className: d,
  children: t,
  ...s
}) => /* @__PURE__ */ o(
  n,
  {
    variant: "ghost",
    padding: "none",
    radius: "none",
    role: "alert",
    className: i("relative w-full min-w-0 rounded-md border p-4", e && "pl-11", m[l], d),
    ...s,
    children: [
      e && /* @__PURE__ */ r("span", { className: "absolute left-4 top-4 text-current", children: e }),
      a && /* @__PURE__ */ r("h5", { className: "mb-1 break-words font-medium leading-tight tracking-tight", children: a }),
      t && /* @__PURE__ */ r(n, { variant: "ghost", padding: "none", radius: "none", className: "break-words text-sm [&_p]:leading-relaxed", children: t })
    ]
  }
);
export {
  c as AlertMoleculeView
};
//# sourceMappingURL=AlertMoleculeView.js.map
