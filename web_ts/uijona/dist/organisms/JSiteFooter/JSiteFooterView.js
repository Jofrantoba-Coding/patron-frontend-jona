import { jsxs as o, jsx as r } from "react/jsx-runtime";
import { cn as a } from "../../lib/cn.js";
const f = ({
  copyright: t,
  links: i,
  className: l
}) => /* @__PURE__ */ o(
  "footer",
  {
    className: a(
      "mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-neutral-200 px-4 py-7 text-sm text-neutral-500",
      l
    ),
    children: [
      /* @__PURE__ */ r("span", { children: t }),
      /* @__PURE__ */ r("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-2", children: i.map((e) => /* @__PURE__ */ r(
        "a",
        {
          href: e.href,
          className: "font-medium text-neutral-500 no-underline transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          children: e.label
        },
        e.href
      )) })
    ]
  }
);
export {
  f as JSiteFooterView
};
//# sourceMappingURL=JSiteFooterView.js.map
