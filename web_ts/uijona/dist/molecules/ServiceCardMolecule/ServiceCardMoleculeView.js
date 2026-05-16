import { jsxs as c, jsx as e } from "react/jsx-runtime";
import { cn as m } from "../../lib/cn.js";
const p = ({
  icon: l,
  title: o,
  description: i,
  tags: r,
  href: n,
  className: s,
  ...d
}) => {
  const a = /* @__PURE__ */ c(
    "div",
    {
      className: m(
        "group flex min-w-0 flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm",
        "transition-shadow duration-200 hover:shadow-md",
        n && "cursor-pointer",
        s
      ),
      ...d,
      children: [
        l && /* @__PURE__ */ e("span", { className: "text-2xl leading-none", "aria-hidden": "true", children: l }),
        /* @__PURE__ */ e("h3", { className: "text-base font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors duration-200", children: o }),
        /* @__PURE__ */ e("p", { className: "flex-1 text-sm leading-relaxed text-neutral-600", children: i }),
        r && r.length > 0 && /* @__PURE__ */ e("div", { className: "flex flex-wrap gap-1.5 pt-1", children: r.map((t) => /* @__PURE__ */ e(
          "span",
          {
            className: "rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600",
            children: t
          },
          t
        )) })
      ]
    }
  );
  return n ? /* @__PURE__ */ e("a", { href: n, className: "block min-w-0 no-underline", children: a }) : a;
};
export {
  p as ServiceCardMoleculeView
};
//# sourceMappingURL=ServiceCardMoleculeView.js.map
