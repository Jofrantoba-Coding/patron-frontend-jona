import { jsxs as s, jsx as e } from "react/jsx-runtime";
import { cn as r } from "../../lib/cn.js";
import { JLabelImpl as i } from "../../atoms/JLabel/JLabelImpl.js";
const o = {
  sm: { avatar: "w-7 h-7 text-xs", text: "text-xs" },
  md: { avatar: "w-10 h-10 text-sm", text: "text-sm" },
  lg: { avatar: "w-14 h-14 text-base", text: "text-base" }
}, f = ({ name: t, email: a, size: l = "md", className: c }) => {
  const m = t.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
  return /* @__PURE__ */ s("div", { className: r("flex items-center gap-3", c), children: [
    /* @__PURE__ */ e(
      "div",
      {
        className: r(
          "flex flex-shrink-0 items-center justify-center rounded-full bg-primary-600 font-semibold text-white",
          o[l].avatar
        ),
        "aria-label": `Avatar de ${t}`,
        "aria-hidden": "true",
        children: m
      }
    ),
    /* @__PURE__ */ s("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e(i, { as: "span", size: "sm", color: "default", className: "block truncate font-medium", children: t }),
      a && /* @__PURE__ */ e(i, { as: "span", size: "xs", color: "muted", className: "block truncate", children: a })
    ] })
  ] });
};
export {
  f as JUserAvatarView
};
//# sourceMappingURL=JUserAvatarView.js.map
