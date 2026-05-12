import { jsxs as o, jsx as e } from "react/jsx-runtime";
import { cn as s } from "../../lib/cn.js";
import { PanelAtomImpl as n } from "../../atoms/PanelAtom/PanelAtomImpl.js";
const N = ({
  north: a,
  south: l,
  east: i,
  west: r,
  center: m,
  northClassName: d,
  southClassName: c,
  eastClassName: t,
  westClassName: f,
  centerClassName: h,
  className: x
}) => /* @__PURE__ */ o(n, { variant: "ghost", padding: "none", radius: "none", className: s("flex min-h-screen w-full max-w-full min-w-0 flex-col overflow-hidden bg-neutral-50", x), children: [
  a && /* @__PURE__ */ e("header", { className: d, children: a }),
  /* @__PURE__ */ o(n, { variant: "ghost", padding: "none", radius: "none", className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:flex-row", children: [
    r && /* @__PURE__ */ e("aside", { className: f, children: r }),
    /* @__PURE__ */ e("main", { className: s("flex min-w-0 flex-1 items-center justify-center overflow-auto p-4 sm:p-6", h), children: m ?? /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: "text-neutral-300 text-sm", children: "No content" }) }),
    i && /* @__PURE__ */ e("aside", { className: t, children: i })
  ] }),
  l && /* @__PURE__ */ e("footer", { className: c, children: l })
] });
export {
  N as BorderLayoutView
};
//# sourceMappingURL=BorderLayoutView.js.map
