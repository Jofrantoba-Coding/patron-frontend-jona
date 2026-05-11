import { jsxs as c, jsx as e } from "react/jsx-runtime";
import { cn as n } from "../../lib/cn.js";
const N = ({
  north: l,
  south: i,
  east: r,
  west: a,
  center: s,
  northClassName: m,
  southClassName: d,
  eastClassName: o,
  westClassName: f,
  centerClassName: t,
  className: x
}) => /* @__PURE__ */ c("div", { className: n("flex min-h-screen w-full max-w-full min-w-0 flex-col overflow-hidden bg-neutral-50", x), children: [
  l && /* @__PURE__ */ e("header", { className: m, children: l }),
  /* @__PURE__ */ c("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:flex-row", children: [
    a && /* @__PURE__ */ e("aside", { className: f, children: a }),
    /* @__PURE__ */ e("main", { className: n("flex min-w-0 flex-1 items-center justify-center overflow-auto p-4 sm:p-6", t), children: s ?? /* @__PURE__ */ e("div", { className: "text-neutral-300 text-sm", children: "No content" }) }),
    r && /* @__PURE__ */ e("aside", { className: o, children: r })
  ] }),
  i && /* @__PURE__ */ e("footer", { className: d, children: i })
] });
export {
  N as BorderLayoutView
};
//# sourceMappingURL=BorderLayoutView.js.map
