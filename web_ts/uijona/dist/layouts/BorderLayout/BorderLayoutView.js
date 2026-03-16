import { jsxs as r, jsx as e } from "react/jsx-runtime";
import { cn as x } from "../../lib/cn.js";
const v = ({
  north: l,
  south: a,
  east: c,
  west: s,
  center: i,
  northClassName: d,
  southClassName: n,
  eastClassName: m,
  westClassName: o,
  centerClassName: t,
  className: h
}) => /* @__PURE__ */ r("div", { className: x("flex flex-col min-h-screen bg-neutral-50", h), children: [
  l && /* @__PURE__ */ e("header", { className: d, children: l }),
  /* @__PURE__ */ r("div", { className: "flex flex-1 overflow-hidden", children: [
    s && /* @__PURE__ */ e("aside", { className: o, children: s }),
    /* @__PURE__ */ e("main", { className: t, children: i ?? /* @__PURE__ */ e("div", { className: "text-neutral-300 text-sm", children: "No content" }) }),
    c && /* @__PURE__ */ e("aside", { className: m, children: c })
  ] }),
  a && /* @__PURE__ */ e("footer", { className: n, children: a })
] });
export {
  v as BorderLayoutView
};
//# sourceMappingURL=BorderLayoutView.js.map
