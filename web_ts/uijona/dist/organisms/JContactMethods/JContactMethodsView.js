import { jsx as i } from "react/jsx-runtime";
import { cn as c } from "../../lib/cn.js";
import { JContactMethodCardImpl as n } from "../../molecules/JContactMethodCard/JContactMethodCardImpl.js";
const p = ({
  methods: r,
  as: l = "section",
  className: e
}) => /* @__PURE__ */ i(l, { className: c("w-full bg-white py-16 sm:py-20", e), children: /* @__PURE__ */ i("div", { className: "mx-auto w-full max-w-6xl px-4 sm:px-6", children: /* @__PURE__ */ i("div", { className: "grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]", children: r.map((a) => /* @__PURE__ */ i(
  n,
  {
    icon: a.icon,
    label: a.label,
    description: a.description,
    href: a.href,
    actionLabel: a.actionLabel,
    isPrimary: a.isPrimary
  },
  a.label
)) }) }) });
export {
  p as JContactMethodsView
};
//# sourceMappingURL=JContactMethodsView.js.map
