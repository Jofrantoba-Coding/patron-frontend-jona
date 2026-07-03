import { jsxs as x, jsx as e } from "react/jsx-runtime";
import { cn as i } from "../../lib/cn.js";
const c = ({
  eyebrow: t,
  heading: l,
  description: a,
  className: s
}) => /* @__PURE__ */ x("div", { className: i("flex min-w-0 flex-col gap-2", s), children: [
  t && /* @__PURE__ */ e("span", { className: "text-xs font-semibold uppercase tracking-wide text-primary-600", children: t }),
  /* @__PURE__ */ e("h2", { className: "text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl", children: l }),
  a && /* @__PURE__ */ e("p", { className: "max-w-prose text-base leading-relaxed text-neutral-600", children: a })
] });
export {
  c as JSectionHeadingView
};
//# sourceMappingURL=JSectionHeadingView.js.map
