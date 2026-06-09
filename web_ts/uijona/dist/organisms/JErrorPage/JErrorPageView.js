import { jsx as e, jsxs as i } from "react/jsx-runtime";
import { JPanelImpl as n } from "../../atoms/JPanel/JPanelImpl.js";
import { JLabelImpl as l } from "../../atoms/JLabel/JLabelImpl.js";
import { JButtonImpl as r } from "../../atoms/JButton/JButtonImpl.js";
const u = ({
  errorCode: a,
  title: m,
  message: o,
  onGoHome: t,
  onGoBack: s,
  primaryLabel: c,
  secondaryLabel: d
}) => /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: "flex w-full flex-col items-center justify-center px-4 py-8 text-center sm:py-12", children: /* @__PURE__ */ i(n, { variant: "ghost", padding: "none", radius: "none", className: "flex w-full max-w-sm flex-col items-center sm:max-w-md", children: [
  a && /* @__PURE__ */ e(
    l,
    {
      as: "p",
      size: "2xl",
      className: "font-extrabold text-blue-600 text-8xl leading-none mb-4 select-none",
      children: a
    }
  ),
  /* @__PURE__ */ e(l, { as: "h1", size: "2xl", className: "font-bold text-gray-900 mb-2", children: m }),
  /* @__PURE__ */ e(l, { as: "p", size: "base", color: "muted", className: "mb-8 break-words", children: o }),
  /* @__PURE__ */ i(n, { variant: "ghost", padding: "none", radius: "none", className: "flex flex-wrap gap-3 justify-center", children: [
    t && /* @__PURE__ */ e(r, { variant: "link", onClick: t, children: c }),
    s && /* @__PURE__ */ e(r, { variant: "outline", onClick: s, children: d })
  ] })
] }) });
export {
  u as JErrorPageView
};
//# sourceMappingURL=JErrorPageView.js.map
