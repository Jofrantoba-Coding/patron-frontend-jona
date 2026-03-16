import { jsxs as s, jsx as e } from "react/jsx-runtime";
import { cn as i } from "../../lib/cn.js";
const v = ({
  north: l,
  south: a,
  east: c,
  west: r,
  center: n,
  northClassName: d,
  southClassName: m,
  eastClassName: o,
  westClassName: t,
  centerClassName: f,
  className: x
}) => /* @__PURE__ */ s("div", { className: i("flex flex-col min-h-screen bg-neutral-50", x), children: [
  l && /* @__PURE__ */ e("header", { className: d, children: l }),
  /* @__PURE__ */ s("div", { className: "flex flex-1 overflow-hidden", children: [
    r && /* @__PURE__ */ e("aside", { className: t, children: r }),
    /* @__PURE__ */ e("main", { className: i("flex-1 overflow-auto flex items-center justify-center", f), children: n ?? /* @__PURE__ */ e("div", { className: "text-neutral-300 text-sm", children: "No content" }) }),
    c && /* @__PURE__ */ e("aside", { className: o, children: c })
  ] }),
  a && /* @__PURE__ */ e("footer", { className: m, children: a })
] });
export {
  v as BorderLayoutView
};
//# sourceMappingURL=BorderLayoutView.js.map
