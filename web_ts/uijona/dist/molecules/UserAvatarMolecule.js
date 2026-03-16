import { jsxs as a, jsx as e } from "react/jsx-runtime";
import { cn as r } from "../lib/cn.js";
import { TextAtom as i } from "../atoms/TextAtom.js";
const n = {
  sm: { avatar: "w-7 h-7 text-xs", text: "text-xs" },
  md: { avatar: "w-10 h-10 text-sm", text: "text-sm" },
  lg: { avatar: "w-14 h-14 text-base", text: "text-base" }
}, p = ({ name: t, email: s, size: l = "md", className: c }) => {
  const o = t.split(" ").map((m) => m[0]).join("").toUpperCase().slice(0, 2);
  return /* @__PURE__ */ a("div", { className: r("flex items-center gap-3", c), children: [
    /* @__PURE__ */ e("div", { className: r("rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold flex-shrink-0", n[l].avatar), "aria-label": `Avatar of ${t}`, children: o || "?" }),
    /* @__PURE__ */ a("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e(i, { as: "span", size: "sm", color: "default", className: "block font-medium truncate", children: t }),
      s && /* @__PURE__ */ e(i, { as: "span", size: "xs", color: "muted", className: "block truncate", children: s })
    ] })
  ] });
};
export {
  p as UserAvatarMolecule
};
//# sourceMappingURL=UserAvatarMolecule.js.map
