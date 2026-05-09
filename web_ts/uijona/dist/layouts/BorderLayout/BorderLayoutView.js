import { jsxs as a, jsx as e } from "react/jsx-runtime";
import { cn as n } from "../../lib/cn.js";
const w = ({
  north: l,
  south: i,
  east: c,
  west: r,
  center: s,
  northClassName: m,
  southClassName: d,
  eastClassName: o,
  westClassName: t,
  centerClassName: f,
  className: x
}) => /* @__PURE__ */ a("div", { className: n("flex min-h-screen min-w-0 flex-col bg-neutral-50", x), children: [
  l && /* @__PURE__ */ e("header", { className: m, children: l }),
  /* @__PURE__ */ a("div", { className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:flex-row", children: [
    r && /* @__PURE__ */ e("aside", { className: t, children: r }),
    /* @__PURE__ */ e("main", { className: n("flex min-w-0 flex-1 items-center justify-center overflow-auto", f), children: s ?? /* @__PURE__ */ e("div", { className: "text-neutral-300 text-sm", children: "No content" }) }),
    c && /* @__PURE__ */ e("aside", { className: o, children: c })
  ] }),
  i && /* @__PURE__ */ e("footer", { className: d, children: i })
] });
export {
  w as BorderLayoutView
};
//# sourceMappingURL=BorderLayoutView.js.map
