import { jsxs as r, jsx as e } from "react/jsx-runtime";
import { cn as n } from "../../lib/cn.js";
import { PanelAtomImpl as a } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { TextAtomImpl as i } from "../../atoms/TextAtom/TextAtomImpl.js";
const d = {
  sm: { avatar: "w-7 h-7 text-xs", text: "text-xs" },
  md: { avatar: "w-10 h-10 text-sm", text: "text-sm" },
  lg: { avatar: "w-14 h-14 text-base", text: "text-base" }
}, u = ({ name: t, email: s, size: o = "md", className: l }) => {
  const m = t.split(" ").map((c) => c[0]).join("").toUpperCase().slice(0, 2);
  return /* @__PURE__ */ r(a, { variant: "ghost", padding: "none", radius: "none", className: n("flex items-center gap-3", l), children: [
    /* @__PURE__ */ e(
      a,
      {
        variant: "ghost",
        padding: "none",
        radius: "none",
        className: n("rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold flex-shrink-0", d[o].avatar),
        "aria-label": `Avatar of ${t}`,
        children: m || "?"
      }
    ),
    /* @__PURE__ */ r(a, { variant: "ghost", padding: "none", radius: "none", className: "min-w-0", children: [
      /* @__PURE__ */ e(i, { as: "span", size: "sm", color: "default", className: "block font-medium truncate", children: t }),
      s && /* @__PURE__ */ e(i, { as: "span", size: "xs", color: "muted", className: "block truncate", children: s })
    ] })
  ] });
};
export {
  u as UserAvatarMoleculeView
};
//# sourceMappingURL=UserAvatarMoleculeView.js.map
